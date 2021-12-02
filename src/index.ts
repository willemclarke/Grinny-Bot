import Discord from 'discord.js';
import os from 'os';
import _ from 'lodash';
import { Faceit } from './api/faceit';
import { getFaceitStatistics } from './commands/faceit/faceit';
import { FaceitService } from './commands/faceit/faceitService';
import { displayHelpCommands } from './commands/help';
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
import { retake } from './commands/retake';

const config: Config = fromEnv();
const discord = new Discord.Client();
const faceitDbService = new FaceitService(config.databaseUrl);

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

  stoicQuoteInterval(vipChannel);

  console.log('Bot is ready!');
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
  }
  // } else if (command === 'graph') {
  //   return faceitUserData(channel);
  // }
  else if (command === 'weather') {
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
    return stoicQuote(channel);
  } else if (command === 'retake') {
    return retake(channel);
  }
});

discord.login(config.discordToken);
