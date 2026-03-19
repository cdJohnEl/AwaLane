import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { searchYouTubeNiche } from "@/lib/youtube";
import { searchTrends, getDailyTrends } from "@/lib/google-trends";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a Nigerian social media trend analyst specializing in TikTok, YouTube, and Instagram content strategy. You help creators find underserved niches.
Ground your analysis in the provided real-world YouTube search results and Google Trends data to assess current competition and search interest.

When given a content idea, analyze it and return EXACTLY 6-8 related niche suggestions in JSON format. Consider:
- Current Nigerian social media landscape and culture
- What's oversaturated vs. what has room to grow (based on YouTube competition)
- Local trends and cultural relevance using simple, clear English. Avoid over-exaggerated Pidgin or heavy slang.
- Platform-specific opportunities (TikTok vs YouTube vs Instagram)
- Search interest levels from Google Trends (higher interest = more demand)

For each niche, assess saturation:
- "open" = Few creators, high opportunity
- "busy" = Growing competition but still viable
- "crowded" = Very saturated, hard to stand out

IMPORTANT: Return ONLY valid JSON in this exact format, no other text.
Do NOT use markdown bolding (**text**) or italics (*text*) inside the JSON strings. Use plain text only.

{
  "niches": [
    {
      "id": "1",
      "name": "Niche name here",
      "saturation": "open",
      "saturationLabel": "Open lane",
      "why": "One sentence explaining why this is good or bad, citing competition levels if possible.",
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

    // Fetch real-world context from YouTube and Google Trends
    const [ytResults, googleTrendData, googleDaily] = await Promise.all([
        searchYouTubeNiche(query),
        searchTrends(query, 'NG'),
        getDailyTrends('NG')
    ]);

    const youtubeContext = ytResults && ytResults.length > 0
        ? `📺 EXISTING YOUTUBE COMPETITION: ${ytResults.slice(0, 5).map((r: any) => r.snippet.title).join(", ")}`
        : "📺 No major competition found in recent YouTube search results for this specific term.";

    const googleTrendsContext = googleTrendData && googleTrendData.default
        ? `🔥 GOOGLE TRENDS INTEREST: People are actively searching for topics related to "${query}"`
        : "";

    const broaderTrendsContext = googleDaily && googleDaily.length > 0
        ? `📈 RELATED SEARCH TRENDS IN NIGERIA: ${googleDaily.slice(0, 3).map((t: any) => t.title).join(", ")}`
        : "";

    const searchContext = `${youtubeContext}\n${googleTrendsContext}\n${broaderTrendsContext}`.trim();

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
          content: `Analyze this content idea for Nigerian creators: "${query}"\n\n${platformContext}\n\n📊 REAL-TIME MARKET DATA:\n${searchContext}\n\nUse this real data to identify underserved niches, assess competition levels, and find content opportunities that align with current search demand. Return JSON with 6-8 niche suggestions.`,
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

    const rawData = JSON.parse(jsonStr.trim());

    // Sanitize data to remove any accidental asterisks
    const sanitize = (str: string) => str.replace(/\*\*/g, "").replace(/\*/g, "");
    
    const data = {
      niches: rawData.niches.map((niche: any) => ({
        ...niche,
        name: sanitize(niche.name),
        why: sanitize(niche.why),
        twists: niche.twists.map((t: string) => sanitize(t))
      }))
    };

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
