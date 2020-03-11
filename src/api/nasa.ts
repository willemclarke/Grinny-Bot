import request from "request";

export interface NasaAPOTDResponse {
  copyright: string;
  date: string;
  title: string;
  url: string;
  code: number;
  msg: string;
  explanation: string;
}

export class NasaAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getAPOTD(): Promise<NasaAPOTDResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://api.nasa.gov/planetary/apod?api_key=${this.token}`
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
