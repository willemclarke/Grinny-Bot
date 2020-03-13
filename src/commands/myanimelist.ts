import Discord from "discord.js";
import _ from "lodash";
import { plotly } from "../index";

import { getAnime, getManga, getAnimeStats, getMangaStats } from "../api/myanimelist";
import { randomString } from "../utils";
import { parse } from "path";

export async function getAnimeInfo(channel: Discord.TextChannel, args: string[]): Promise<void> {
  try {
    if (!args.length) {
      channel.send(
        `\`\`\`You didn't provide enough arguments: requires: <!anime anime_title>, spaced anime names require: <!anime "anime title">\`\`\``
      );
    } else {
      const [name] = args;
      const animeData = await getAnime(name);
      const { url, image_url, synopsis, episodes, score, members, title, type, airing, mal_id } = animeData;
      const formattedEpisodes = episodes === 0 ? "Unknown Episodes" : `${episodes}`;
      const formattedAiring = airing === false ? "Finished Airing" : "Currently Airing";

      const animeStats = await getAnimeStats(mal_id);
      const xAxis = _.map(Object.keys(animeStats), key => {
        return parseInt(key);
      });
      const yAxis = _.map(animeStats, anime => {
        return anime.votes;
      });

      const layout = {
        title: `Vote distribution for ${title}`,
        yaxis: {
          title: "Number of Votes"
        }
      };

      const imgOpts = {
        format: "jpeg",
        width: 800,
        height: 500
      };

      const data = {
        x: xAxis,
        y: yAxis,
        type: "bar"
      };

      const fileName = `${randomString(16)}.jpeg`;
      await plotly.createGraph(data, layout, imgOpts, fileName);

      const discordAnimeResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `MyAnimeList Information for ${title} (${type}) `,
        url,
        thumbnail: {
          url: image_url
        },
        image: {
          url: `attachment://${fileName}`
        },
        fields: [
          {
            name: "**Score**",
            value: `Rated **${score}** by **${members}** members`
          },
          {
            name: "**Synopsis**",
            value: `${synopsis}`
          },
          {
            name: "**Status**",
            value: `${formattedAiring}`
          },
          {
            name: "**Episodes**",
            value: `${formattedEpisodes}`
          }
        ]
      });

      await channel.send({
        embed: discordAnimeResponse,
        files: [{ attachment: fileName, name: fileName }]
      });

      plotly.deleteFile(fileName);
    }
  } catch (err) {
    channel.send(`\`\`\`${err}\`\`\``);
  }
}

export async function getMangaInfo(channel: Discord.TextChannel, args: string[]): Promise<void> {
  try {
    if (!args.length) {
      channel.send(
        `\`\`\`You didn't provide enough arguments: requires: <!manga manga_title>, spaced manga names require: <!manga "manga title">\`\`\``
      );
    } else {
      const [name] = args;
      const mangaData = await getManga(name);
      const { mal_id, url, image_url, synopsis, score, members, title, type, publishing, volumes, chapters } = mangaData;
      const formattedPublishing = publishing === false ? "Finished Publishing" : "Currently Publishing";
      const formattedChapters = chapters === 0 ? "Unknown Chapters" : `${chapters}`;
      const formattedVolumes = volumes === 0 ? "Unknown Volumes" : `${volumes}`;

      const mangaStats = await getMangaStats(mal_id);
      const xAxis = _.map(Object.keys(mangaStats), key => {
        return parseInt(key);
      });
      const yAxis = _.map(mangaStats, manga => {
        return manga.votes;
      });

      const layout = {
        title: `Vote distribution for ${title}`,
        yaxis: {
          title: `Number of votes`
        }
      };

      const imgOpts = {
        format: "jpeg",
        width: 800,
        height: 500
      };

      const data = {
        x: xAxis,
        y: yAxis,
        type: "bar"
      };

      const fileName = `${randomString(16)}.jpeg`;
      await plotly.createGraph(data, layout, imgOpts, fileName);

      const discordMangaResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `MyAnimeList Information for ${title} (${type}) `,
        url,
        thumbnail: {
          url: image_url
        },
        image: {
          url: `attachment://${fileName}`
        },
        fields: [
          {
            name: "**Score**",
            value: `Rated **${score}** by **${members}** members`
          },
          {
            name: "**Synopsis**",
            value: `${synopsis}`
          },
          {
            name: "**Status**",
            value: `${formattedPublishing}`
          },
          {
            name: "**Volumes**",
            value: `${formattedVolumes}`
          },
          {
            name: "**Chapters**",
            value: `${formattedChapters}`
          }
        ]
      });

      await channel.send({
        embed: discordMangaResponse,
        files: [{ attachment: fileName, name: fileName }]
      });

      plotly.deleteFile(fileName);
    }
  } catch (err) {
    channel.send(`\`\`\`${err}\`\`\``);
  }
}
