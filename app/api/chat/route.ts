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
    console.log("Request received:", req.body);
    const body = await req.json();
    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    // const response = await model.generateContent(body.prompt);
    // const habits = JSON.parse(response?.text || "");
    console.log(body.prompt)
    const result = await model.generateContent(body.prompt);
    console.log(result.response.text().toString().replace("```json", "").replace("```", ""));
    // const habits = JSON.parse(result.response.text());
    return NextResponse.json({ data: JSON.parse(result.response.text().toString().replace("```json", "").replace("```", "")) });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate habits." },
      { status: 500 }
    );
  }
}
