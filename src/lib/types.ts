export type SaturationLevel = "open" | "busy" | "crowded";

export interface NicheResult {
  id: string;
  name: string;
  saturation: SaturationLevel;
  saturationLabel: string;
  why: string;
  twists: string[];
  cardGradient: string;
}

export type Platform = "tiktok" | "youtube" | "instagram" | "all";

export interface SearchState {
  query: string;
  platform: Platform;
  isSearching: boolean;
  hasSearched: boolean;
}
