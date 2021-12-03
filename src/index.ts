import Discord from 'discord.js';
import os from 'os';
import _ from 'lodash';
import { Faceit } from './api/faceit/faceit';
import { displayFaceitStatistics } from './commands/faceit/faceit';
import { FaceitService } from './api/faceit/faceitService';
import { displayHelpCommands } from './commands/help';
import { WeatherAPI } from './api/weather';
import { displayWeather } from './commands/weather';
import { NasaAPI } from './api/nasa';
import { displayAstronomyPic } from './commands/nasa';
import { UrbanAPI } from './api/urban';
import { displayUrbanDictionaryDefinition } from './commands/urban';
import { IMDBAPI } from './api/imdb';
import { displayImdbInfo } from './commands/imdb';
import { displayAnimeInfo, displayMangaInfo } from './commands/myanimelist';
import { displayStoicQuote, stoicQuoteInterval } from './commands/stoic';
import { fromEnv, Config } from './config';
import { Plotly } from './api/plotly';
import { retake } from './commands/retake';

const config: Config = fromEnv();
const discord = new Discord.Client();
// const faceitDbService = new FaceitService(config.databaseUrl);

export const faceit = new Faceit(config.faceitToken);
export const weatherAPI = new WeatherAPI(config.weatherToken);
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

  if (command === 'help') {
    return displayHelpCommands(channel);
  } else if (command === 'stats') {
    return displayFaceitStatistics(channel, args);
  } else if (command === 'weather') {
    return displayWeather(channel, args);
  } else if (command === 'nasa') {
    return displayAstronomyPic(channel);
  } else if (command === 'urban') {
    return displayUrbanDictionaryDefinition(channel, args);
  } else if (command === 'imdb') {
    return displayImdbInfo(channel, args);
  } else if (command === 'anime') {
    return displayAnimeInfo(channel, args);
  } else if (command === 'manga') {
    return displayMangaInfo(channel, args);
  } else if (command === 'stoic') {
    return displayStoicQuote(channel);
  } else if (command === 'retake') {
    return retake(channel);
  }
});

discord.login(config.discordToken);
