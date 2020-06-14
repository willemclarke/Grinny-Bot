import Discord from "discord.js";
import _ from "lodash";
import { weatherAPI } from "..";

export function getWeather(
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return channel.send(
      `\`\`\`You didnt provide enough arguments: !weather <city_name> is required, Cities with more than one word names require !weather <"New York">\`\`\``
    );
  } else {
    const [cityName] = args;

    return weatherAPI.getWeather(cityName).then((weatherDetails) => {
      if (weatherDetails.cod !== 200) {
        return channel.send(
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
          icon_url:
            "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg",
        },
        title: `Weather for ${cityName}`,
        color: 0x7289da,
        timestamp: new Date(),
        fields: [
          {
            name: "**Temperature**",
            value: `${Math.round(weatherDetails.main.temp)}°C`,
          },
          {
            name: "**Minimum Temperature**",
            value: `${Math.round(weatherDetails.main.temp_min)}°C`,
          },
          {
            name: "**Maximum Temperature**",
            value: `${Math.round(weatherDetails.main.temp_max)}°C`,
          },
          {
            name: "**Wind Speed**",
            value: `${windSpeedKmh} Km/h`,
          },
          {
            name: "**Weather Conditions**",
            value: _.upperFirst(weatherDetails.weather[0]["description"]),
          },
        ],
        image: {
          url: weatherIcon,
        },
      });

      return channel.send(discordWeatherResponse);
    });
  }
}
