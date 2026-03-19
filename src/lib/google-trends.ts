import googleTrends from 'google-trends-api';

export interface TrendData {
  title: string;
  formattedTraffic: string;
  traffic: number;
  date: string;
}

export async function getDailyTrends(geo: string = 'NG'): Promise<TrendData[]> {
  try {
    const response = await googleTrends.dailyTrends({
      geo: geo,
      hl: 'en-US'
    });

    // Check if response is HTML (blocked) instead of JSON
    if (typeof response === 'string' && (response.includes('<!doctype') || response.includes('<html'))) {
      console.warn('Google Trends API is being blocked (HTML response)');
      return [];
    }

    const data = JSON.parse(response);

    if (data.default && data.default.trendingSearchesDays) {
      const trends = data.default.trendingSearchesDays[0]?.trendingSearches || [];

      return trends.map((trend: any) => ({
        title: trend.title.query,
        formattedTraffic: trend.formattedTraffic,
        traffic: parseInt(trend.formattedTraffic?.replace(/[^0-9]/g, '') || '0'),
        date: trend.date,
        relatedQueries: trend.relatedQueries?.map((rq: any) => rq.query) || []
      }));
    }

    return [];
  } catch (error) {
    console.warn('Google Trends daily fetch failed (likely rate limited or blocked)');
    return [];
  }
}

export async function getRealTimeTrends(geo: string = 'NG'): Promise<TrendData[]> {
  try {
    const response = await googleTrends.realTimeTrends({
      geo: geo,
      hl: 'en-US'
    });

    // Check if response is HTML (blocked) instead of JSON
    if (typeof response === 'string' && (response.includes('<!doctype') || response.includes('<html'))) {
      console.warn('Google RealTime Trends API is being blocked (HTML response)');
      return [];
    }

    const data = JSON.parse(response);

    if (data.storyClusters) {
      return data.storyClusters.map((cluster: any) => ({
        title: cluster.title,
        formattedTraffic: cluster.score ? `${Math.round(cluster.score * 100)}%` : 'N/A',
        traffic: cluster.score || 0,
        date: new Date().toISOString(),
        relatedQueries: cluster.articles?.map((a: any) => a.title).slice(0, 3) || []
      })).slice(0, 15);
    }

    return [];
  } catch (error) {
    console.warn('Google RealTime Trends fetch failed (likely rate limited or blocked)');
    return [];
  }
}

export async function searchTrends(keyword: string, geo: string = 'NG'): Promise<any> {
  try {
    const response = await googleTrends.interestOverTime({
      keyword: keyword,
      geo: geo,
      hl: 'en-US'
    });

    // Check if response is HTML (blocked) instead of JSON
    if (typeof response === 'string' && (response.includes('<!doctype') || response.includes('<html'))) {
      return null;
    }

    return JSON.parse(response);
  } catch (error) {
    console.warn('Google Trends search failed');
    return null;
  }
}

// Fallback mock data when Google Trends API is blocked
export function getFallbackTrends(): TrendData[] {
  return [
    { title: "Nigerian music trends", formattedTraffic: "100K+", traffic: 100000, date: new Date().toISOString() },
    { title: "Nollywood movie releases", formattedTraffic: "50K+", traffic: 50000, date: new Date().toISOString() },
    { title: "Tech news in Nigeria", formattedTraffic: "75K+", traffic: 75000, date: new Date().toISOString() }
  ];
}
