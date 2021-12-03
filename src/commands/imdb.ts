import Discord from 'discord.js';
import _ from 'lodash';
import { imdbApi } from '..';
import { GRINNY_BOT_ICON } from '../types/constants';
import { codeblockMsg } from '../utils';

export const displayImdbInfo = async (
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> => {
  try {
    if (!args.length) {
      return channel.send(
        `\`\`\`You didn't provide enough arguments: requires: <!imdb movie_show_title>, spaced movie/film names require: <!imdb "movie show title">\`\`\``
      );
    }
    const [title] = args;

    const imdbData = await imdbApi.getImdbData(title);
    const checkDirectorExists = imdbData.Director === 'N/A' ? 'Unable to Fetch' : imdbData.Director;

    const checkRottenTomatoesExists =
      imdbData.Ratings[1] && imdbData.Ratings[1].Value
        ? imdbData.Ratings[1].Value
        : 'Unable to Fetch ';

    const checkMetaCriticExists =
      imdbData.Ratings[2] && imdbData.Ratings[2].Value
        ? imdbData.Ratings[2].Value
        : 'Unable to Fetch';

    const changeRunTimeFormatDependingOnMovieType =
      imdbData.Type === 'series'
        ? `${_.upperFirst(imdbData.Type)}, ${imdbData.Runtime} per episode`
        : `${_.upperFirst(imdbData.Type)}, ${imdbData.Runtime}`;

    const discordImdbResponse = new Discord.RichEmbed({
      color: 0x7289da,
      timestamp: new Date(),
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      title: `IMDB Information for ${imdbData.Title}`,
      description: imdbData.Plot,
      url: `https://www.imdb.com/title/${imdbData.imdbID}/`,
      thumbnail: {
        url: 'https://cdn0.iconfinder.com/data/icons/social-media-2091/100/social-31-512.png',
      },
      fields: [
        {
          name: '**Directed by**',
          value: checkDirectorExists,
        },
        {
          name: '**Main Cast**',
          value: imdbData.Actors,
        },
        {
          name: '**Released on**',
          value: imdbData.Released,
        },
        {
          name: '**Genre and Rating**',
          value: `${imdbData.Genre} - ${imdbData.Rated}`,
        },
        {
          name: '**Film Type and Runtime**',
          value: changeRunTimeFormatDependingOnMovieType,
        },
        {
          name: '**IMDB Rating**',
          value: `${imdbData.imdbRating}/10 from ${imdbData.imdbVotes} votes`,
        },
        {
          name: '**Rotten Tomatoes Score**',
          value: checkRottenTomatoesExists,
        },
        {
          name: '**Metacritic Score**',
          value: checkMetaCriticExists,
        },
        {
          name: '**Awards**',
          value: imdbData.Awards,
        },
      ],
      image: {
        url: imdbData.Poster,
      },
    });

    return channel.send(discordImdbResponse);
  } catch (error) {
    return await channel.send(
      codeblockMsg(
        `${error} -> Please ensure correct spelling of the movie/series! Movie/seriess with spaced names require double quotes: <!imdb "Spaced Name">`
      )
    );
  }
};
