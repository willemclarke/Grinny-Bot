import axios from 'axios';

export interface NasaResponse {
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

  async getNasaData(): Promise<NasaResponse> {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${this.token}`);
    return response.data;
  }
}
