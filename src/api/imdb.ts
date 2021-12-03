import axios from 'axios';

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
  Ratings: [
    { Source: string; Value: string },
    { Source: string; Value: string },
    { Source: string; Value: string }
  ];
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
}

export class IMDBAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
  async getImdbData(title: string): Promise<ImdbResponse> {
    const response = await axios.get(
      `http://www.omdbapi.com/?t=${title}&plot=full&apikey=${this.token}`
    );
    return response.data;
  }
}
