import Discord from 'discord.js';
import { displayFaceitStatistics } from './commands/faceit/displayFaceitStatistics';
import { displayRatingGraph, displayRatingGraphForce } from './commands/faceit/displayRatingGraph';
import { displayHelpCommands } from './commands/help';
import { displayImdbInfo } from './commands/imdb';
import { displayAnimeInfo, displayMangaInfo } from './commands/myanimelist';
import { displayAstronomyPic } from './commands/nasa';
import { retake } from './commands/retake';
import { displayStoicQuote } from './commands/stoic';
import { displayWeather } from './commands/weather';
import { codeblockMsg } from './utils';

export type Command =
  | 'help'
  | 'stats'
  | 'graph'
  | 'graph force'
  | 'weather'
  | 'nasa'
  | 'imdb'
  | 'anime'
  | 'manga'
  | 'stoic'
  | 'retake';

export const run = (command: Command, channel: Discord.TextChannel, args: string[]) => {
  switch (command) {
    case 'help':
      return displayHelpCommands(channel);
    case 'stats':
      return displayFaceitStatistics(channel, args);
    case 'graph':
      return displayRatingGraph(channel);
    case 'graph force':
      return displayRatingGraphForce(channel);
    case 'weather':
      return displayWeather(channel, args);
    case 'nasa':
      return displayAstronomyPic(channel);
    case 'imdb':
      return displayImdbInfo(channel, args);
    case 'anime':
      return displayAnimeInfo(channel, args);
    case 'manga':
      return displayMangaInfo(channel, args);
    case 'stoic':
      return displayStoicQuote(channel);
    case 'retake':
      return retake(channel);
    default:
      return channel.send(
        codeblockMsg('Invalid command, to see list of valid commands type !help')
      );
  }
};
