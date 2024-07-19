import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";

export const revalidate = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});
export async function POST(request: NextRequest) {
  const url = request.url;
  const data = await request.json();


  const openAiResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "The following is a transcript from a german lecture. Only add headings when the conversation switches to a noticeably different topics. Fix any terminologies that have been transcribed wrongly based on the context of the subject. YOU MUST NOT CHANGE ANYTHING ELSE.",
      },
      {
        role: "user",
        content: data.text,
      },
    ],
  });
  const response = NextResponse.json({
    data: openAiResponse.choices[0].message.content || "",
    id: data.id,
  });

  return response;
}
