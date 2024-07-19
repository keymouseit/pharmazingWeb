import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";

export const revalidate = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});
export async function POST(request: NextRequest) {
  // gotta use the request object to invalidate the cache every request :vomit:
  const url = request.url;
  const { content } = await request.json();


  const openAiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "I will give you a sentence or parts of a sentence(at least a word) from a german university lecture transcribed. I want you to fix any mistakes in the sentence based on the subject context. And only return the fixed text. You must not change any content if, don't rephrase. Simply fix any transcription mistakes that you think occurred. And reply with the original input if it is for example empty or too short, don't reply any error messages. DO NOT REPLY WITH ANYTHING ELSE.",
      },
      {
        role: "user",
        content,
      },
    ],
  });
  const response = NextResponse.json({
    data: openAiResponse.choices[0].message.content || "",
  });

  return response;
}
