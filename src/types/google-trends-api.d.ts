declare module 'google-trends-api' {
  interface TrendOptions {
    geo?: string;
    hl?: string;
    timezone?: number;
    category?: number;
    startTime?: Date;
    endTime?: Date;
  }

  interface DailyTrendOptions extends TrendOptions {
    trendDate?: Date;
  }

  interface RealTimeTrendOptions extends TrendOptions {
    geo: string;
  }

  interface InterestOverTimeOptions extends TrendOptions {
    keyword: string | string[];
    resolution?: string;
  }

  export function dailyTrends(options: DailyTrendOptions): Promise<string>;
  export function realTimeTrends(options: RealTimeTrendOptions): Promise<string>;
  export function interestOverTime(options: InterestOverTimeOptions): Promise<string>;
  export function relatedQueries(options: TrendOptions & { keyword: string | string[] }): Promise<string>;
  export function relatedTopics(options: TrendOptions & { keyword: string | string[] }): Promise<string>;
  export function interestByRegion(options: TrendOptions & { keyword: string | string[] }): Promise<string>;

  const googleTrends: {
    dailyTrends: typeof dailyTrends;
    realTimeTrends: typeof realTimeTrends;
    interestOverTime: typeof interestOverTime;
    relatedQueries: typeof relatedQueries;
    relatedTopics: typeof relatedTopics;
    interestByRegion: typeof interestByRegion;
  };

  export default googleTrends;
}
