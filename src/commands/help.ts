import Discord from 'discord.js';

export const displayHelpCommands = (
  channel: Discord.TextChannel
): Promise<Discord.Message | Discord.Message[]> => {
  const listOfCommands = new Discord.RichEmbed({
    author: {
      name: 'GrinnyBot',
      icon_url:
        'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
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
        name: '**!stocks**',
        value: `Stock Market Information Command: requires <!stocks STOCK_SYMBOL> e.g. <!stocks TWTR>`,
      },
      {
        name: '**!nasa**',
        value: `NASA Astronomy Picture of the Day Command: simply requires <!nasa>`,
      },
      {
        name: '**!urban**',
        value: `Urban Dictionary Command: requires <!urban WORD>, spaced words require: <!urban "SPACED WORD">`,
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
