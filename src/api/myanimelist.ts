import rp from "request-promise";

export enum MediumType {
  anime = "anime",
  manga = "manga"
}
// Mal manga response && mal anime response --> api function for each separately
export interface MALSearchResponse {
  status: number;
  message: string;
  mal_id: number;
  url: string;
  image_url: string;
  title: string;
  airing: boolean;
  publishing: boolean;
  synopsis: string;
  type: string;
  episodes: number;
  volumes: number;
  chapters: number;
  members: number;
  score: number;
  start_date: string;
  end_date: string;
}

export interface AnimeAndMangaStats {
  [rating: number]: {
    votes: number;
    percentage: number;
  };
}

export async function getAnimeManga(type: MediumType, title: string): Promise<MALSearchResponse> {
  const options = {
    url: `https://api.jikan.moe/v3/search/${type}?q=${title}&page=1&limit=1`,
    json: true
  };
  const result = await rp(options);
  return result.results[0];
}

export async function getAnimeMangaStats(type: MediumType, mal_id: number): Promise<AnimeAndMangaStats> {
  const options = {
    url: `https://api.jikan.moe/v3/${type}/${mal_id}/stats/`,
    json: true
  };
  const result = await rp(options);
  return result.scores;
}
