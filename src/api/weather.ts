import axios from 'axios';

export interface WeatherResponse {
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  visibility: number;
  wind: {
    speed: number;
  };
  cod: string | number;
  message?: string;
}

export class WeatherAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getWeather(cityName: string): Promise<WeatherResponse> {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${this.token}`
    );
    return response.data;
  }
}
