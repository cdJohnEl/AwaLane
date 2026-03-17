import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a viral content strategist for Nigerian creators on TikTok, YouTube, and Instagram. 
Your goal is to provide highly actionable, culturally relevant, and high-energy content.
Use Nigerian Pidgin and local slang (e.g., "no cap", "lamba", "japa", "steeze") where appropriate to make it sound authentic.
Focus on the Nigerian market but maintain high production quality standards.`;

export async function POST(req: Request) {
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json(
            { error: "GROQ_API_KEY is not defined" },
            { status: 500 }
        );
    }

    try {
        const { type, niche, twist, platform } = await req.json();

        let userPrompt = "";

        if (type === "script") {
            userPrompt = `Write a viral 60-second video script for this niche: "${niche}".
      The specific angle is: "${twist}".
      Platform: ${platform}.
      Structure:
      1. Hook (0-5s): Catchy, visual, or controversial.
      2. Body (5-50s): Fast-paced, educational or entertaining.
      3. Call to Action (50-60s): Relatable and direct.
      Include stage directions in [brackets].`;
        } else if (type === "hooks") {
            userPrompt = `Generate 5 viral hooks for this niche: "${niche}".
      Angle: "${twist}".
      Platform: ${platform}.
      Make them extremely clickable and relatable to Nigerians. Mix English and Pidgin.`;
        } else if (type === "seo") {
            userPrompt = `Generate 5 viral YouTube/Instagram titles and 10 trending hashtags for this niche: "${niche}".
      Angle: "${twist}".
      Optimize for the Nigerian algorithm.`;
        }

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2048,
        });

        const content = response.choices[0].message.content;

        return NextResponse.json({ result: content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate content" },
            { status: 500 }
        );
    }
}
