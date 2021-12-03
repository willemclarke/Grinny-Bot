import Discord from 'discord.js';
import { GRINNY_BOT_ICON } from '../types/constants';

export const displayHelpCommands = async (
  channel: Discord.TextChannel
): Promise<Discord.Message | Discord.Message[]> => {
  const listOfCommands = new Discord.RichEmbed({
    author: {
      name: 'GrinnyBot',
      icon_url: GRINNY_BOT_ICON,
    },
    title: 'List of Discord Commands',
    color: 0x7289da,
    timestamp: new Date(),
    fields: [
      {
        name: '**!stats**',
        value: 'Faceit Statistics Command: requires <!stats csgo Faceit_Name>',
      },
      {
        name: '**!weather**',
        value: `Weather Information Command: requires <!weather City_Name>, Cities such as New York require: <!weather "New York">`,
      },
      {
        name: '**!nasa**',
        value: `NASA Astronomy Picture of the Day Command: simply requires <!nasa>`,
      },
      {
        name: '**!imdb**',
        value: `IMDB Movie/series Information Command: requires <!urban Movie>, spaced words require: <!urban "Spaced Movie/Series">`,
      },
      {
        name: '**!anime & !manga**',
        value: `MyAnimeList Anime/Manga series information Command: requires: <!anime title> <!manga title>, spaced titles require: <!anime "spaced title name">`,
      },
      {
        name: '**!stoic**',
        value: 'Stoic quote generator command: requires <!stoic>',
      },
    ],
  });

  return channel.send(listOfCommands);
};
