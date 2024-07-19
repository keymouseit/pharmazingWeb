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
  const blob = await request.blob();
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const deepgramResponse = await deepgram.listen.prerecorded.transcribeFile(
    buffer,
    {
      model: "nova-2",
      smart_format: true,
      language: "de",
    }
  );

  const text =
    deepgramResponse.result?.results.channels[0].alternatives[0].transcript ||
    "";

  if (text.length < 2) {
    console.log("Audio too short error!")
    return NextResponse.json({
      error: "Couldn't transcribe audio, audio might be too short, not clear enough or doesn't contain any german content. Please try again.",
    });
  }
  console.log(deepgramResponse);
  console.log(text);

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
        content: text,
      },
    ],
  });
  const response = NextResponse.json({
    data: openAiResponse.choices[0].message.content || "",
  });

  return response;
}
