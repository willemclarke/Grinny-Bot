import Discord from 'discord.js';
import os from 'os';
import _ from 'lodash';
import { PIT_CHANNEL_ID, PREFIX, VIP_CHANNEL_ID } from './types/constants';
import { FaceitAPI } from './api/faceit/faceitApi';
import { displayFaceitStatistics } from './commands/faceit/displayFaceitStatistics';
import { FaceitService } from './api/faceit/faceitService';
import { displayHelpCommands } from './commands/help';
import { WeatherAPI } from './api/weather';
import { displayWeather } from './commands/weather';
import { NasaAPI } from './api/nasa';
import { displayAstronomyPic } from './commands/nasa';
import { IMDBAPI } from './api/imdb';
import { displayImdbInfo } from './commands/imdb';
import { displayAnimeInfo, displayMangaInfo } from './commands/myanimelist';
import { displayStoicQuote, stoicQuoteInterval } from './commands/stoic';
import { fromEnv, Config } from './config';
import { Plotly } from './api/plotly';
import { retake } from './commands/retake';
import { codeblockMsg } from './utils';

interface DiscordMessageOverride {
  channel: Discord.TextChannel;
  content: string;
  author: Discord.User;
}

const config: Config = fromEnv();
const discord = new Discord.Client();
const faceitDbService = new FaceitService(config.databaseUrl);

export const faceitApi = new FaceitAPI(config.faceitToken);
export const weatherApi = new WeatherAPI(config.weatherToken);
export const nasaApi = new NasaAPI(config.nasaToken);
export const imdbApi = new IMDBAPI(config.imdbToken);
export const plotlyApi = new Plotly(config.plotlyUsername, config.plotlyToken, config.plotlyHost);

discord.once('ready', async () => {
  const pitOfSmithChannel = discord.channels.get(PIT_CHANNEL_ID) as Discord.TextChannel;
  const vipChannel = discord.channels.get(VIP_CHANNEL_ID) as Discord.TextChannel;

  await faceitDbService.insertElo({ username: 'm00sebreeder', rating: 2600, date: new Date() });
  await faceitDbService.getElosForPlayer('m00sebreeder');

  console.log('GrinnyBot is ready!');
  await pitOfSmithChannel.send(
    codeblockMsg(`Bot has successfully started up on hostname: ${os.hostname}`)
  );

  stoicQuoteInterval(vipChannel);
});

discord.on('message', async (message) => {
  const { channel, content, author } = <DiscordMessageOverride>message;

  if (!content.startsWith(PREFIX) || author.bot) {
    return;
  }

  const splitStringArgs = content.slice(PREFIX.length).split('"');
  const args = _.chain(splitStringArgs)
    .flatMap((arg, index) => (index === 0 ? arg.split(' ') : arg))
    .compact()
    .value();

  const command: string | undefined = args?.shift()?.toLowerCase();

  if (!command) {
    return channel.send('Not a valid command!');
  }

  if (command === 'help') {
    return await displayHelpCommands(channel);
  } else if (command === 'stats') {
    return await displayFaceitStatistics(channel, args);
  } else if (command === 'weather') {
    return await displayWeather(channel, args);
  } else if (command === 'nasa') {
    return await displayAstronomyPic(channel);
  } else if (command === 'imdb') {
    return await displayImdbInfo(channel, args);
  } else if (command === 'anime') {
    return await displayAnimeInfo(channel, args);
  } else if (command === 'manga') {
    return await displayMangaInfo(channel, args);
  } else if (command === 'stoic') {
    return await displayStoicQuote(channel);
  } else if (command === 'retake') {
    return await retake(channel);
  }
});

discord.login(config.discordToken);
