export async function getTrendingVideos() {
    const API_KEY = process.env.YOUTUBE_DATA_API_KEY;
    if (!API_KEY) return [];

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=NG&maxResults=10&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items) {
            return data.items.map((item: any) => ({
                title: item.snippet.title,
                description: item.snippet.description,
                viewCount: item.statistics.viewCount,
                channelTitle: item.snippet.channelTitle
            }));
        }
        return [];
    } catch (error) {
        console.error("YouTube Trending Fetch Error:", error);
        return [];
    }
}

export async function searchYouTubeNiche(query: string) {
    const API_KEY = process.env.YOUTUBE_DATA_API_KEY;
    if (!API_KEY) return null;

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&regionCode=NG&maxResults=5&key=${API_KEY}`
        );
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("YouTube Search Error:", error);
        return null;
    }
}
