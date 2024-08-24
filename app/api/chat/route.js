import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { HfInference } from '@huggingface/inference';
import { headers } from "next/headers";
// import { StreamingTextResponse } from 'ai';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const pc_index = pc.index(process.env.PINECONE_INDEX_NAME)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an advanced chatbot assistant specializing in providing information about universities. Your task is to assist users with their questions regarding university details, such as course information, admissions, faculty, and campus life.

1. **Response Formatting:** Use '\n' for new lines and '\n\n' for new paragraphs to ensure your responses are well-formatted and easy to read.

2. **Contextual Understanding:** Understand the context of the user's question. If the query is not related to universities (e.g., greetings or general conversation), respond appropriately without referencing university data.

3. **Information Retrieval:** For university-related queries, you will receive the top 5 pieces of relevant information retrieved from a Pinecone vector database. Each piece of information will be a separate result relevant to the user's query.

4. **Data Validation:** As the vector database may not be well-structured, critically assess the retrieved information for relevance and accuracy before using it in your response.

5. **Response Generation:** For university-related queries, use the validated information from the top 5 retrieved results to craft a comprehensive and accurate response. If the information from Pinecone is insufficient or irrelevant, provide general advice or suggest checking official university resources.

6. **User Interaction:** Maintain a conversational tone, ensuring clarity and completeness in your responses based on the provided information.

7. **Limitations:** If the retrieved information does not fully answer the question, acknowledge this and suggest alternative ways to find more details.

Please ensure that your responses are informative and tailored to the user's needs. For university-related queries, base your response on the validated information from the top 5 results from Pinecone. For non-university queries, respond appropriately without referencing the Pinecone data.`
});
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY, { fetch: global.fetch });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
  
const getResponseFromBot = async (history, userPrompt) => {
    const chatSession = model.startChat({
    generationConfig,
    history: history,
    });

    const result = await chatSession.sendMessageStream(userPrompt);
    return result;
}

const vectorizeUserQuery = async (user_query) => {
    // const embeddingPipeline = await pipeline('feature-extraction', process.env.EMBEDDING_MODEL);
    const embedding = await hf.featureExtraction({
        model: process.env.EMBEDDING_MODEL,
        inputs: user_query
    });
    return embedding
}


const generateUserPromptAfterInfoRetrieval = async (user_query) => {
    const vectorizedQuery = await vectorizeUserQuery(user_query)
    const res = await pc_index.query({
        topK: 5,
        includeMetadata: true,
        vector: vectorizedQuery
    })

    let result = '\n\n`The following top 5 pieces of information were retrieved from the vector db (pinecone):\n\n'
    res.matches.forEach(data => {
        result += `\nUniversity Name: ${data.metadata['Institution Name']}\nOverall score: ${data.metadata.Overall}\nWorld ranking: ${data.metadata.Rank}\nUniversity Location: ${data.metadata.Location}`
    })
    result += `\n\nBased on this information, answer the user's query: "${user_query}"`
    return result
}


export async function POST(request){
    const data = await request.json()
    const userPrompt = await generateUserPromptAfterInfoRetrieval(data.userQuery);
    const stream = await getResponseFromBot(data.history, userPrompt);

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream.stream) {
                controller.enqueue(new TextEncoder().encode(chunk.text()));
            }
            controller.close();
        }
    })
    return new NextResponse(readableStream, {
        headers : { 'Content-Type': 'text/plain; chatset=utf-8'}
    });
}