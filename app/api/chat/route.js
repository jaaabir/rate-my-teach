import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { HfInference } from '@huggingface/inference';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const pc_index = pc.index(process.env.PINECONE_INDEX_NAME)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are an advanced chatbot assistant specializing in providing information about universities. Your task is to assist users with their questions regarding university details, such as course information, admissions, faculty, and campus life.\n\n1. **Contextual Understanding:** Understand the context of the user's question related to universities.\n2. **Information Retrieval:** You will first receive the top 3 pieces of relevant information retrieved from a Pinecone vector database. Each piece of information will be a separate result relevant to the user's query.\n3. **Response Generation:** Use the top 3 retrieved results to craft a comprehensive and accurate response. If the information from Pinecone is insufficient, provide general advice or suggest checking official university resources.\n4. **User Interaction:** Maintain a conversational tone, ensuring clarity and completeness in your responses based on the provided information.\n5. **Limitations:** If the retrieved information does not fully answer the question, acknowledge this and suggest alternative ways to find more details.\n\nPlease ensure that your responses are informative and tailored to the user's needs based on the top 3 results from Pinecone.",
});
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

    const result = await chatSession.sendMessage(userPrompt);
    return result.response.text();
}

const vectorizeUserQuery = async (user_query) => {

    // const embeddingPipeline = await pipeline('feature-extraction', process.env.EMBEDDING_MODEL);
    const embedding = await hf.featureExtraction({
        model: process.env.EMBEDDING_MODEL,
        inputs: user_query
    });

    console.log(embedding)
    return embedding
}


const generateUserPromptAfterInfoRetrieval = async (user_query) => {
    const vectorizedQuery = await vectorizeUserQuery(user_query)
    const res = await pc_index.query({
        topK: 5,
        includeMetadata: true,
        vector: vectorizedQuery
    })

    let result = '\n\n`The following top 3 pieces of information were retrieved from the vector db (pinecone):\n\n'
    res.matches.forEach(data => {
        result += `\nUniversity Name: ${data.metadata['Institution Name']}\nOverall score: ${data.metadata.Overall}\nWorld ranking: ${data.metadata.Rank}\nUniversity Location: ${data.metadata.Location}`
    })
    result += `\n\nBased on this information, answer the user's query: "${user_query}"`
    return result
}


export async function POST(request){
    const data = await request.json()
    console.log('in the api')
    console.log(data)
    const userPrompt = await generateUserPromptAfterInfoRetrieval(data.userQuery);
    const bot_response = await getResponseFromBot(data.history, userPrompt);
    return NextResponse.json({bot_response})
}