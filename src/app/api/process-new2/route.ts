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
  console.log(deepgramResponse);

  const text =
    deepgramResponse.result?.results.channels[0].alternatives[0].transcript ||
    "";

  const paragraphs =
    deepgramResponse.result?.results.channels[0].alternatives[0].paragraphs?.paragraphs ||
    [];

  if (text.length < 2) {
    console.log("Audio too short error!")
    return NextResponse.json({
      error: "Couldn't transcribe audio, audio might be too short, not clear enough or doesn't contain any german content. Please try again.",
    });
  }
  console.log(deepgramResponse);
  console.log(text);


  const response = NextResponse.json({
    data: {
      text: text,
      paragraphs: paragraphs,
    },
  });

  return response;
}
