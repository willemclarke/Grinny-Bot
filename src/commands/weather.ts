import * as Discord from "discord.js";
import * as _ from "lodash";
import { weatherAPI } from "..";

export function getWeather(message: Discord.Message, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return message.channel.send(
      `\`\`\`You didnt provide enough arguments: !weather <city_name> is required, Cities with more than one word names require !weather <"New York">\`\`\``
    );
  } else {
    const [cityName] = args;

    weatherAPI.getWeather(cityName).then(weatherDetails => {
      if (weatherDetails.cod !== 200) {
        return message.channel.send(
          _.upperFirst(
            `\`\`\`${weatherDetails.message} --> Make sure you're entering a correct city name!\`\`\`` ||
              `\`\`\`Unknown error occured\`\`\``
          )
        );
      }

      const windSpeedKmh: number = Math.round(weatherDetails.wind.speed * 1.852);
      const weatherIcon: string = `http://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`;

      const discordWeatherResponse = new Discord.RichEmbed({
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `Weather for ${cityName}`,
        color: 0x7289da,
        timestamp: new Date(),
        fields: [
          {
            name: "Temperature",
            value: `${Math.round(weatherDetails.main.temp)}°C`
          },
          {
            name: "Weather Conditions",
            value: _.upperFirst(weatherDetails.weather[0]["description"])
          },
          {
            name: "Minimum Temperature",
            value: `${Math.round(weatherDetails.main.temp_min)}°C`
          },
          {
            name: "Maximum Temperature",
            value: `${Math.round(weatherDetails.main.temp_max)}°C`
          },
          {
            name: "Wind Speed",
            value: `${windSpeedKmh} Km/h`
          }
        ],
        image: {
          url: weatherIcon
        }
      });

      return message.channel.send(discordWeatherResponse);
    });
  }
}
