import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a viral content strategist for Nigerian creators on TikTok, YouTube, and Instagram. 
Your goal is to provide highly actionable, culturally relevant, and high-energy content.
Use clear, simple English that is easy to understand. Avoid over-exaggerated Pidgin or heavy slang.
Focus on the Nigerian market but maintain high production quality standards.
Do NOT use markdown formatting like bolding (**text**) or italics (*text*). Use plain text only.`;

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
      - Hook (0-5s)
      - Body (5-50s)
      - Call to Action (50-60s)
      Include stage directions in [brackets].
      IMPORTANT: Return plain text only. Do NOT use markdown bolding (**) or italics (*).`;
        } else if (type === "hooks") {
            userPrompt = `Generate 5 viral hooks for this niche: "${niche}".
      Angle: "${twist}".
      Platform: ${platform}.
      Return ONLY a JSON object with a "hooks" field containing an array of 5 strings.
      No other text. No markdown. No bolding.`;
        } else if (type === "seo") {
            userPrompt = `Generate 5 viral YouTube/Instagram titles and 10 trending hashtags for this niche: "${niche}".
      Angle: "${twist}".
      Return ONLY a JSON object with "titles" (array of 5) and "hashtags" (array of 10) fields.
      No other text. No markdown. No bolding.`;
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

        const content = response.choices[0].message.content || "";
        
        // Try to parse as JSON if it's hooks or seo
        if (type === "hooks" || type === "seo") {
            let jsonStr = content;
            if (content.includes("```")) {
                jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
            }
            try {
                const data = JSON.parse(jsonStr.trim());
                return NextResponse.json({ result: data, isJson: true });
            } catch (e) {
                console.warn("Failed to parse JSON for", type, content);
            }
        }

        const cleanContent = content.replace(/\*\*/g, "").replace(/\*/g, "");
        return NextResponse.json({ result: cleanContent, isJson: false });
    } catch (error: any) {
        console.error("Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate content" },
            { status: 500 }
        );
    }
}
