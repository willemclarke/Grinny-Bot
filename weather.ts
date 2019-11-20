import * as request from "request";

export class WeatherAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getWeather(cityName: string): Promise<object> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${this.token}`
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
