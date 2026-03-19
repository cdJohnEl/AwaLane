import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getTrendingVideos } from "@/lib/youtube";
import { getDailyTrends, getRealTimeTrends } from "@/lib/google-trends";
import { mockNicheResults } from "@/lib/mock-data";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || "",
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a Nigerian social media trend analyst specializing in TikTok, YouTube, and Instagram. 
Ground your analysis in the provided real-time YouTube trending data for Nigeria. 
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
      "why": "One sentence explaining why this is trending right now in Nigeria, referencing real-time trends where applicable.",
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

        // Fetch real trends from multiple sources
        const youtubeTrends = await getTrendingVideos();
        const googleDailyTrends = await getDailyTrends('NG');
        const googleRealTimeTrends = await getRealTimeTrends('NG');

        console.log('Fetched real data:', {
            youtube: youtubeTrends.length,
            googleDaily: googleDailyTrends.length,
            googleRealTime: googleRealTimeTrends.length
        });

        // Combine all trend data for richer context
        const youtubeTitles = youtubeTrends.map((v: any) => v.title).slice(0, 5);
        const googleTrendTitles = [
            ...googleDailyTrends.slice(0, 5).map((t: any) => t.title),
            ...googleRealTimeTrends.slice(0, 5).map((t: any) => t.title)
        ];

        const allTrends = [...youtubeTitles, ...googleTrendTitles];
        const hasRealData = allTrends.length > 0;

        const trendsContext = hasRealData
            ? `CURRENT REAL-TIME DATA FOR NIGERIA:\n\n📺 YOUTUBE TRENDING: ${youtubeTitles.join(" | ")}\n\n${googleTrendTitles.length > 0 ? `🔥 GOOGLE SEARCH TRENDS: ${googleTrendTitles.slice(0, 8).join(" | ")}` : ''}\n\nUse this real data to identify underserved niches and content opportunities.`
            : "Focus on general high-potential Nigerian creator niches.";

        // If no Groq API key, return mock data with real YouTube trends mixed in
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
            console.warn('Groq API key not configured, using mock data');

            // Return a mix of mock data and real YouTube trends
            const mixedNiches = hasRealData ? [
                ...mockNicheResults.slice(0, 4),
                {
                    ...mockNicheResults[0],
                    id: 'yt-trend-1',
                    name: `Based on YouTube Trending: ${youtubeTitles[0]?.substring(0, 30) || 'Trending Nigerian Content'}`,
                    why: `Currently trending in Nigeria with high engagement. YouTube data shows strong interest in this topic.`,
                    twists: youtubeTitles.slice(0, 4).map((title: string, i: number) =>
                        `Create content around: ${title.substring(0, 50)}...`
                    )
                }
            ] : mockNicheResults;

            const gradients = ["card-gradient-1", "card-gradient-2", "card-gradient-3", "card-gradient-4", "card-gradient-5", "card-gradient-6"];

            return NextResponse.json({
                niches: mixedNiches.map((niche: any, index: number) => ({
                    ...niche,
                    cardGradient: gradients[index % gradients.length]
                })),
                warning: "Using mock data - Groq API key not configured"
            });
        }

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Analyze these current trends and find 6 trending content niches for Nigerian creators right now: \n\n${trendsContext}`,
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
