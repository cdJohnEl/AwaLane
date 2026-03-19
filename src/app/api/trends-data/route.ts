import { NextRequest, NextResponse } from "next/server";
import { getTrendingVideos, searchYouTubeNiche } from "@/lib/youtube";
import { getDailyTrends, getRealTimeTrends, searchTrends } from "@/lib/google-trends";

export async function GET() {
    try {
        // Fetch all trend data sources
        const [youtubeTrends, googleDaily, googleRealtime] = await Promise.all([
            getTrendingVideos(),
            getDailyTrends('NG'),
            getRealTimeTrends('NG')
        ]);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: {
                youtube: {
                    source: "YouTube Data API",
                    count: youtubeTrends.length,
                    trends: youtubeTrends.slice(0, 5).map((v: any) => ({
                        title: v.title,
                        channel: v.channelTitle,
                        views: v.viewCount
                    }))
                },
                googleDaily: {
                    source: "Google Daily Trends API",
                    count: googleDaily.length,
                    trends: googleDaily.slice(0, 5).map((t: any) => ({
                        title: t.title,
                        traffic: t.formattedTraffic,
                        related: t.relatedQueries?.slice(0, 3)
                    }))
                },
                googleRealtime: {
                    source: "Google RealTime Trends API",
                    count: googleRealtime.length,
                    trends: googleRealtime.slice(0, 5).map((t: any) => ({
                        title: t.title,
                        traffic: t.formattedTraffic,
                        related: t.relatedQueries?.slice(0, 3)
                    }))
                }
            },
            summary: {
                totalTrends: youtubeTrends.length + googleDaily.length + googleRealtime.length,
                allTrendTitles: [
                    ...youtubeTrends.map((v: any) => v.title),
                    ...googleDaily.map((t: any) => t.title),
                    ...googleRealtime.map((t: any) => t.title)
                ].slice(0, 20)
            }
        });
    } catch (error: any) {
        console.error("Trends Data API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch trends data",
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { keyword } = await request.json();

        if (!keyword) {
            return NextResponse.json(
                { error: "Keyword is required" },
                { status: 400 }
            );
        }

        // Search trends for specific keyword
        const [youtubeResults, googleResults] = await Promise.all([
            searchYouTubeNiche(keyword),
            searchTrends(keyword, 'NG')
        ]);

        return NextResponse.json({
            success: true,
            keyword,
            data: {
                youtube: youtubeResults,
                googleTrends: googleResults
            }
        });
    } catch (error: any) {
        console.error("Trends Search Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to search trends",
                details: error.message
            },
            { status: 500 }
        );
    }
}
