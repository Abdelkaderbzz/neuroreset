import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    const result = await model.generateContent(body.prompt);
    return NextResponse.json({ data: JSON.parse(result.response.text().toString().replace("```json", "").replace("```", "")) });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate habits." },
      { status: 500 }
    );
  }
}
