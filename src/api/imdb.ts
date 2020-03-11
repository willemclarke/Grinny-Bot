import request from "request";

export interface ImdbResponse {
  Title: string;
  Rated: string;
  Released: string;
  Type: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Awards: string;
  Poster: string;
  Ratings: [{ Source: string; Value: string }, { Source: string; Value: string }, { Source: string; Value: string }];
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Response: string;
  Error: string;
}

export class IMDBAPI {
  token: string | undefined;

  constructor(token: string | undefined) {
    this.token = token;
  }

  getImdbData(title: string): Promise<ImdbResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `http://www.omdbapi.com/?t=${title}&plot=full&apikey=${this.token}`
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
