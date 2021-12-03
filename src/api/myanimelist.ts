import rp from 'request-promise';
import axios from 'axios';

interface MALSearchAnimeResponse {
  mal_id: number;
  url: string;
  image_url: string;
  title: string;
  airing: boolean;
  synopsis: string;
  type: string;
  episodes: number;
  score: number;
  start_date: string;
  end_date: string;
  members: number;
  rated: string;
}

interface MALSearchMangaResponse {
  mal_id: number;
  url: string;
  image_url: string;
  title: string;
  publishing: boolean;
  synopsis: string;
  type: string;
  chapters: number;
  volumes: number;
  score: number;
  start_date: string;
  end_date: string;
  members: number;
}

export interface MALStatsResponse {
  [rating: number]: {
    votes: number;
    percentage: number;
  };
}

export async function getAnime(name: string): Promise<MALSearchAnimeResponse> {
  const response = await axios.get(
    `https://api.jikan.moe/v3/search/anime?q=${name}&page=1&limit=1`
  );
  return response.data.results[0];
}

export async function getAnimeStats(mal_id: number): Promise<MALStatsResponse> {
  const response = await axios.get(`https://api.jikan.moe/v3/anime/${mal_id}/stats`);
  return response.data.scores;
}

export async function getManga(name: string): Promise<MALSearchMangaResponse> {
  const response = await axios.get(
    `https://api.jikan.moe/v3/search/manga?q=${name}&page=1&limit=1`
  );
  return response.data.results[0];
}

export async function getMangaStats(mal_id: number): Promise<MALStatsResponse> {
  const response = await axios.get(`https://api.jikan.moe/v3/manga/${mal_id}/stats`);
  return response.data.scores;
}
