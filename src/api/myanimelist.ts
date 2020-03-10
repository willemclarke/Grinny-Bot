import * as request from "request";
import rp from "request-promise";
import { StringNullableChain } from "lodash";

export enum MediumType {
  anime = "anime",
  manga = "manga"
}

export interface AnimeAndManga {
  results: [
    {
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
  ];
}

export function getAnimeManga(type: MediumType, title: string): Promise<AnimeAndManga> {
  return new Promise((resolve, reject) => {
    const options = {
      url: `https://api.jikan.moe/v3/search/${type}?q=${title}&page=1&limit=1`
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(body));
    });
  });
}
