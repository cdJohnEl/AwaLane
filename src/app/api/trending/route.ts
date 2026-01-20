import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || "",
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a Nigerian social media trend analyst specializing in TikTok, YouTube, and Instagram. 
Identify 6 CURRENTLY trending or high-potential underserved niches specifically for Nigerian creators. 
Consider local culture, current events in Nigeria, and underserved audiences.

Return ONLY valid JSON in this exact format:
{
  "niches": [
    {
      "id": "1",
      "name": "Niche name here",
      "saturation": "open",
      "saturationLabel": "Open lane",
      "why": "One sentence explaining why this is trending right now in Nigeria",
      "twists": [
        "Specific content idea 1",
        "Specific content idea 2",
        "Specific content idea 3",
        "Specific content idea 4"
      ]
    }
  ]
}

Use these saturation values: "open", "busy", "crowded".
Use these saturationLabel values: "Open lane", "Hidden gem", "Lots of room!", "Getting busy", "Growing fast".`;

export async function GET() {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not defined");
        }

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: "Find 6 trending content niches for Nigerian creators right now.",
                },
            ],
            temperature: 0.8,
            max_tokens: 4096,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No response from AI");
        }

        let jsonStr = content;
        if (content.includes("```")) {
            jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        }

        const data = JSON.parse(jsonStr.trim());

        // Add card gradients
        const gradients = [
            "card-gradient-1",
            "card-gradient-2",
            "card-gradient-3",
            "card-gradient-4",
            "card-gradient-5",
            "card-gradient-6",
        ];

        const nichesWithGradients = data.niches.map(
            (niche: any, index: number) => ({
                ...niche,
                cardGradient: gradients[index % gradients.length],
            })
        );

        return NextResponse.json({ niches: nichesWithGradients });
    } catch (error: any) {
        console.error("Trending API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch trending niches", details: error.message },
            { status: 500 }
        );
    }
}
