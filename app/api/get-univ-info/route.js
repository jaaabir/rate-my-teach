import { NextResponse } from 'next/server'
import Groq from 'groq-sdk';

const systemPrompt = `Objective:
The system is designed to scrape and extract basic details from a provided URL, specifically targeting educational institutions. The AI will use the Groq API to fetch the HTML content, classify the website, and return HTTP status codes based on the success and completeness of the data extraction.

Instructions for the AI:

Receive Input:

Accept a URL from the user, which points to a website that may belong to an educational institution.
Fetch HTML Content:

Use the Groq API to retrieve the HTML content of the provided URL.
Classify Institution:

Analyze the HTML content to determine if it is an educational institution (university, college, or similar). Look for indicators such as:
Keywords like "University", "College", "Institute", etc., in title tags, headings, or prominent sections.
Presence of common educational institution elements, such as "About Us", "Programs", "Admissions", etc.
Extract Information:

University Name: Locate and extract the name of the institution from the HTML content. This may be in the <title> tag, <h1>, or similar prominent locations.
Address: Extract the address from relevant sections like the footer or "Contact Us" page. Look for <address>, <p>, or similar tags.
About Paragraph: Find and extract the main "About" paragraph or section. This may be within <section>, <div>, or other content containers with appropriate classes or IDs.
Determine Status Code and Output:

200 OK: If the institution's name, address, and about paragraph are all successfully extracted.
250 Partial Content: If only the institution name is extracted, but other details (address, about paragraph) are missing.
400 Bad Request: If the URL does not correspond to an educational institution, or if there is a significant issue that prevents extraction of meaningful data.
Output Formatting:

Format the output as a JSON object including the extracted information and the status code. Ensure the output is clear and organized.

Output JSON Examples:
{
  "name": "Example University",
  "address": "1234 University Ave, College Town, CT 12345",
  "about_paragraph": "Example University is committed to providing quality education in various fields of study...",
  "status_code": 200
}

{
  "name": "",
  "address": "",
  "about_paragraph": "",
  "status_code": 400
}

{
  "name": "Example Education",
  "address": "",
  "about_paragraph": "",
  "status_code": 250
}

Notes:

Ensure that the scraping logic is robust and can handle various website structures.`

const groq = new Groq({ apiKey: process.env.UNIV_FINDER_API_KEY });
const getUnivInformation = async (url) => {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": url
          }
        ],
        "model": process.env.UNIV_FINDER_MODEL,
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "response_format": {
          "type": "json_object"
        },
        "stop": null
      });
    
      return JSON.parse(chatCompletion.choices[0].message.content)
    }

export async function POST(request){
  const { url } = request.json()
  const result = await getUnivInformation(url);
  return NextResponse.json(result);
}





