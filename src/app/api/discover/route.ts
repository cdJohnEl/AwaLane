import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

if (!process.env.GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY is not defined in environment variables");
}

const SYSTEM_PROMPT = `You are a Nigerian social media trend analyst specializing in TikTok, YouTube, and Instagram content strategy. You help creators find underserved niches.

When given a content idea, analyze it and return EXACTLY 6-8 related niche suggestions in JSON format. Consider:
- Current Nigerian social media landscape and culture
- What's oversaturated vs. what has room to grow
- Local trends, Pidgin English angles, and cultural relevance
- Platform-specific opportunities (TikTok vs YouTube vs Instagram)

For each niche, assess saturation:
- "open" = Few creators, high opportunity
- "busy" = Growing competition but still viable
- "crowded" = Very saturated, hard to stand out

Return ONLY valid JSON in this exact format, no other text:
{
  "niches": [
    {
      "id": "1",
      "name": "Niche name here",
      "saturation": "open",
      "saturationLabel": "Open lane",
      "why": "One sentence explaining why this is good or bad",
      "twists": [
        "Specific content idea 1",
        "Specific content idea 2",
        "Specific content idea 3",
        "Specific content idea 4"
      ]
    }
  ]
}

Use these saturationLabel values:
- For "open": "Open lane", "Hidden gem", or "Lots of room!"
- For "busy": "Getting busy" or "Growing fast"
- For "crowded": "Very crowded" or "Packed lane"`;

export async function POST(request: NextRequest) {
  try {
    const { query, platform } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const platformContext =
      platform && platform !== "all"
        ? `Focus specifically on ${platform} opportunities.`
        : "Consider all platforms: TikTok, YouTube, and Instagram.";

    console.log("Starting search for query:", query, "platform:", platform);

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this content idea for Nigerian creators: "${query}"\n\n${platformContext}\n\nReturn JSON with 6-8 niche suggestions.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON from response (handle potential markdown code blocks)
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
      (niche: Record<string, unknown>, index: number) => ({
        ...niche,
        cardGradient: gradients[index % gradients.length],
      })
    );

    return NextResponse.json({ niches: nichesWithGradients });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze niche. Please try again.",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
