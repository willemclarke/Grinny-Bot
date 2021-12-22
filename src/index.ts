import Discord from 'discord.js';
import os from 'os';
import _ from 'lodash';
import { PIT_CHANNEL_ID, PREFIX, VIP_CHANNEL_ID } from './types/constants';
import { FaceitAPI } from './api/faceit/faceitApi';
import { FaceitService } from './api/faceit/faceitService';
import { WeatherAPI } from './api/weather';
import { NasaAPI } from './api/nasa';
import { IMDBAPI } from './api/imdb';
import { stoicQuoteInterval } from './commands/stoic';
import { fromEnv, Config } from './config';
import { Plotly } from './api/plotly';
import { codeblockMsg } from './utils';
import { createPool } from 'slonik';
import { run, Command } from './run';

interface DiscordMessageOverride {
  channel: Discord.TextChannel;
  content: string;
  author: Discord.User;
}

const config: Config = fromEnv();
const discord = new Discord.Client();

export const faceitApi = new FaceitAPI(config.faceitToken);
export const weatherApi = new WeatherAPI(config.weatherToken);
export const nasaApi = new NasaAPI(config.nasaToken);
export const imdbApi = new IMDBAPI(config.imdbToken);
export const plotlyApi = new Plotly(config.plotlyUsername, config.plotlyToken, config.plotlyHost);

const databasePool = createPool(config.databaseUrl, { ssl: { rejectUnauthorized: false } });
export const faceitDbService = new FaceitService(config.databaseUrl, faceitApi, databasePool);

discord.once('ready', async () => {
  const pitOfSmithChannel = discord.channels.get(PIT_CHANNEL_ID) as Discord.TextChannel;
  const vipChannel = discord.channels.get(VIP_CHANNEL_ID) as Discord.TextChannel;

  console.log('GrinnyBot is ready!');
  await pitOfSmithChannel.send(
    codeblockMsg(`Bot has successfully started up on hostname: ${os.hostname}`)
  );

  faceitDbService.pollFaceitElos();
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

  if (_.isUndefined(command)) {
    return channel.send('Not a valid command!');
  }

  run(command as Command, channel, args);
});

discord.login(config.discordToken);
