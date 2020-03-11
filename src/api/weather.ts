import request from "request";

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

  getWeather(cityName: string): Promise<WeatherResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${this.token}`
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
