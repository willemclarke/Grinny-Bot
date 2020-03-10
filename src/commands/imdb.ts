import * as Discord from "discord.js";
import * as _ from "lodash";
import { imdbAPI } from "..";

export function getImdbInfo(channel: Discord.TextChannel, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return channel.send(
      `\`\`\`You didn't provide enough arguments: requires: <!imdb movie_show_title>, spaced movie/film names require: <!imdb "movie show title">\`\`\``
    );
  } else {
    const [title] = args;

    imdbAPI.getImdbData(title).then(imdbResponse => {
      const {
        Title,
        Rated,
        Released,
        Type,
        Runtime,
        Genre,
        Director,
        Actors,
        Plot,
        Awards,
        Poster,
        imdbRating,
        imdbVotes,
        imdbID,
        Ratings,
        Response,
        Error
      } = imdbResponse;

      if (Response && Response === "False") {
        return channel.send(
          `\`\`\`${Error} --> Please ensure correct spelling of the movie/series! Movie/seriess with spaced names require double quotes: <!imdb "Spaced Name">\`\`\``
        );
      }

      const checkDirectorExists = Director === "N/A" ? "Unable to Fetch" : Director;
      const checkRottenTomatoesExists = Ratings[1] && Ratings[1].Value ? Ratings[1].Value : "Unable to Fetch ";
      const checkMetaCriticExists = Ratings[2] && Ratings[2].Value ? Ratings[2].Value : "Unable to Fetch";
      const changeRunTimeFormatDependingOnMovieType =
        Type === "series" ? `${_.upperFirst(Type)}, ${Runtime} per episode` : `${_.upperFirst(Type)}, ${Runtime}`;

      const discordImdbResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `IMDB Information for ${Title}`,
        description: Plot,
        url: `https://www.imdb.com/title/${imdbID}/`,
        thumbnail: {
          url: "https://cdn0.iconfinder.com/data/icons/social-media-2091/100/social-31-512.png"
        },
        fields: [
          {
            name: "Directed by",
            value: checkDirectorExists
          },
          {
            name: "Main Cast",
            value: Actors
          },
          {
            name: "Released on",
            value: Released
          },
          {
            name: "Genre and Rating",
            value: `${Genre} - ${Rated}`
          },
          {
            name: "Film Type and Runtime",
            value: changeRunTimeFormatDependingOnMovieType
          },
          {
            name: `IMDB Rating`,
            value: `${imdbRating}/10 from ${imdbVotes} votes`
          },
          {
            name: "Rotten Tomatoes Score",
            value: checkRottenTomatoesExists
          },
          {
            name: "Metacritic Score",
            value: checkMetaCriticExists
          },
          {
            name: "Awards",
            value: Awards
          }
        ],
        image: {
          url: Poster
        }
      });

      return channel.send(discordImdbResponse);
    });
  }
}
