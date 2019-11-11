import * as request from "request";

export class Faceit {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getStats(game: string, username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        url: "https://open.faceit.com/data/v4/players",
        qs: { nickname: username, game: game },
        headers: { Authorization: `Bearer ${this.token}` }
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
