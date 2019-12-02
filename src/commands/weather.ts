import * as Discord from "discord.js";
import * as _ from "lodash";
import { weatherAPI } from "..";

export function getWeather(message: Discord.Message, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return message.channel.send(
      `\`\`\`You didnt provide enough arguments: !weather <city_name> is required, Cities with more than one word names require ""\`\`\``
    );
  } else {
    const [cityName] = args;

    weatherAPI.getWeather(cityName).then(weatherDetails => {
      if (weatherDetails.cod !== 200) {
        return message.channel.send(
          _.upperFirst(`\`\`\`weatherDetails.message\`\`\`` || `\`\`\`Unknown error occured\`\`\``)
        );
      }
      const mainTempCelcius: number = Math.round(weatherDetails.main.temp - 273.15);
      const minTempCelcius: number = Math.round(weatherDetails.main.temp_min - 273.15);
      const maxTempCelcius: number = Math.round(weatherDetails.main.temp_max - 273.15);
      const windSpeedKmh: number = Math.round(weatherDetails.wind.speed * 1.852);

      const discordWeatherResponse = new Discord.RichEmbed({
        author: {
          name: "Smithoath",
          icon_url:
            "https://vignette.wikia.nocookie.net/harrypotter/images/e/e3/Gringotts_Head_Goblin.jpg/revision/latest?cb=20100214234030"
        },
        title: `Weather for ${cityName}`,
        color: 0x7289da,
        timestamp: new Date(),
        fields: [
          {
            name: "Weather Conditions",
            value: weatherDetails.weather[0]["description"]
          },
          {
            name: "Temperature",
            value: `${mainTempCelcius}°C`
          },
          {
            name: "Minimum Temperature",
            value: `${minTempCelcius}°C`
          },
          {
            name: "Maximum Temperature",
            value: `${maxTempCelcius}°C`
          },
          {
            name: "Visibility",
            value: `${weatherDetails.visibility}`
          },
          {
            name: "Wind Speed",
            value: `${windSpeedKmh} Km/h`
          }
        ]
      });

      return message.channel.send(discordWeatherResponse);
    });
  }
}
