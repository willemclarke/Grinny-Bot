import Discord from 'discord.js';
import _ from 'lodash';
import { weatherApi } from '..';
import { GRINNY_BOT_ICON } from '../types/constants';
import { codeblockMsg } from '../utils';

export const displayWeather = async (
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> => {
  if (!args.length) {
    return channel.send(
      codeblockMsg(
        'You didnt provide enough arguments: !weather <city_name> is required, Cities with more than one word names require !weather <"New York">'
      )
    );
  }
  const [cityName] = args;

  try {
    const weatherData = await weatherApi.getWeather(cityName);

    if (weatherData.cod !== 200) {
      return channel.send(codeblockMsg(weatherData?.message ?? `Unknown error occured`));
    }

    const windSpeedKmh = Math.round(weatherData.wind.speed * 1.852);
    const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    const discordWeatherResponse = new Discord.RichEmbed({
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      title: `Weather for ${_.upperFirst(cityName)}`,
      color: 0x7289da,
      timestamp: new Date(),
      fields: [
        {
          name: '**Temperature**',
          value: `${Math.round(weatherData.main.temp)}°C`,
        },
        {
          name: '**Minimum Temperature**',
          value: `${Math.round(weatherData.main.temp_min)}°C`,
        },
        {
          name: '**Maximum Temperature**',
          value: `${Math.round(weatherData.main.temp_max)}°C`,
        },
        {
          name: '**Wind Speed**',
          value: `${windSpeedKmh} Km/h`,
        },
        {
          name: '**Weather Conditions**',
          value: _.upperFirst(weatherData.weather[0]['description']),
        },
      ],
      image: {
        url: weatherIcon,
      },
    });

    return channel.send(discordWeatherResponse);
  } catch (error) {
    return channel.send(codeblockMsg(`${error}`));
  }
};
