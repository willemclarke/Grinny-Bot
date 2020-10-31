import Discord from 'discord.js';
import os from 'os';
import _ from 'lodash';
import { Faceit } from './api/faceit';
import { getFaceitStatistics, faceitUserData } from './commands/faceit';
import { WeatherAPI } from './api/weather';
import { getWeather } from './commands/weather';
import { StocksAPI } from './api/stocks';
import { getIndividualStockData } from './commands/stocks';
import { NasaAPI } from './api/nasa';
import { getAstronomyPic, astronomyPicInterval } from './commands/nasa';
import { UrbanAPI } from './api/urban';
import { getUrbanDictionaryDefinition } from './commands/urban';
import { IMDBAPI } from './api/imdb';
import { getImdbInfo } from './commands/imdb';
import { getAnimeInfo, getMangaInfo } from './commands/myanimelist';
import { stoicQuote, stoicQuoteInterval } from './commands/stoic';
import { fromEnv, Config } from './config';
import { Plotly } from './api/plotly';


const config: Config = fromEnv();
const discord = new Discord.Client();

export const faceit = new Faceit(config.faceitToken);
export const weatherAPI = new WeatherAPI(config.weatherToken);
export const stocksAPI = new StocksAPI(config.stocksToken);
export const nasaAPI = new NasaAPI(config.nasaToken);
export const urbanAPI = new UrbanAPI(config.urbanToken);
export const imdbAPI = new IMDBAPI(config.imdbToken);
export const plotly = new Plotly(config.plotlyUsername, config.plotlyToken, config.plotlyHost);

const pitId: string = '642229195405131776';
const vipId: string = '444358361098616833';
const prefix: string = '!';

discord.once('ready', () => {
  const pitOfSmithChannel = discord.channels.get(pitId) as Discord.TextChannel;
  const vipChannel = discord.channels.get(vipId) as Discord.TextChannel;

  astronomyPicInterval(vipChannel);
  stoicQuoteInterval(vipChannel);

  console.log('Ready!');
  pitOfSmithChannel.send(`\`\`\`Bot has successfully started up on hostname: ${os.hostname}\`\`\``);
});

discord.on('message', (message) => {
  const { channel, content, author } = <
    { channel: Discord.TextChannel; content: string; author: Discord.User }
  >message;

  if (!content.startsWith(prefix) || author.bot) {
    return;
  }

  const splitStringArgs: string[] = content.slice(prefix.length).split('"');
  const args: string[] = _.chain(splitStringArgs)
    .flatMap((arg, index) => (index === 0 ? arg.split(' ') : arg))
    .compact()
    .value();

  const command: string | undefined = args?.shift()?.toLowerCase();

  if (!command) {
    return channel.send('Not a valid command!');
  }

  if (command === 'ping') {
    channel.send('Pong.');
  } else if (command === 'help') {
    return displayHelpCommands(channel);
  } else if (command === 'stats') {
    return getFaceitStatistics(channel, args);
  } else if (command === 'graph') {
    return faceitUserData(channel);
  } else if (command === 'weather') {
    return getWeather(channel, args);
  } else if (command === 'stocks') {
    return getIndividualStockData(channel, args);
  } else if (command === 'nasa') {
    return getAstronomyPic(channel);
  } else if (command === 'urban') {
    return getUrbanDictionaryDefinition(channel, args);
  } else if (command === 'imdb') {
    return getImdbInfo(channel, args);
  } else if (command === 'anime') {
    return getAnimeInfo(channel, args);
  } else if (command === 'manga') {
    return getMangaInfo(channel, args);
  } else if (command === 'stoic') {
    return stoicQuote(channel)
  }
});

function displayHelpCommands(channel: Discord.TextChannel): Promise<Discord.Message | Discord.Message[]> {
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
      { name: '**!stats**', value: 'Faceit Statistics Command: requires <!stats csgo Faceit_Name>' },
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
        name: "**!stoic**",
        value: 'Stoic quote generator command: requires <!stoic>'
      }
    ],
  });

  return channel.send(listOfCommands);
}

export function formatDiscordMessage(object: object): string {
  return _.reduce(object, (acc: string[], value, key) => _.concat(acc, `${key}: ${value}`), []).join('\n');
}

discord.login(config.discordToken);
