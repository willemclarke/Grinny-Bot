import * as request from "request";

export interface UrbanApiResponse {
  list: [
    {
      word: string;
      definition: string;
      example: string;
      author: string;
      written_on: string;
      permalink: string;
      thumbs_up: number;
    }
  ];
}

export class UrbanAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getUrbanDictionary(term: string): Promise<UrbanApiResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://mashape-community-urban-dictionary.p.rapidapi.com/define`,
        qs: { term: term },
        headers: { "x-rapidapi-key": this.token }
      };

      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body));
      });
    });
  }
}
