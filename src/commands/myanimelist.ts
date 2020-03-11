import Discord from "discord.js";
import _ from "lodash";
import { getAnime, getManga } from "../api/myanimelist";

export async function getAnimeInfo(channel: Discord.TextChannel, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  try {
    if (!args.length) {
      return channel.send(
        `\`\`\`You didn't provide enough arguments: requires: <!anime anime_title>, spaced anime names require: <!anime "anime title">\`\`\``
      );
    } else {
      const [name] = args;
      const animeData = await getAnime(name);
      const { url, image_url, synopsis, episodes, rated, score, members, title, type, airing } = animeData;
      const formattedAiring = airing === false ? "Finished Airing" : "Currently Airing";

      const discordAnimeResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `MyAnimeList Information for ${title} (${type}) `,
        url: url,
        image: {
          url: image_url
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
            value: `${episodes}`
          }
        ]
      });

      return channel.send(discordAnimeResponse);
    }
  } catch (err) {
    return channel.send(`\`\`\`${err}\`\`\``);
  }
}

export async function getMangaInfo(channel: Discord.TextChannel, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  try {
    if (!args.length) {
      return channel.send(
        `\`\`\`You didn't provide enough arguments: requires: <!manga manga_title>, spaced manga names require: <!manga "manga title">\`\`\``
      );
    } else {
      const [name] = args;
      const mangaData = await getManga(name);
      const { url, image_url, synopsis, score, members, title, type, publishing, volumes, chapters } = mangaData;
      const formattedPublishing = publishing === false ? "Finished Publishing" : "Currently Publishing";
      const formattedChapters = chapters === 0 ? "Unknown Chapters" : `${chapters}`;
      const formattedVolumes = volumes === 0 ? "Unknown Volumes" : `${volumes}`;

      const discordMangaResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: "GrinnyBot",
          icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
        },
        title: `MyAnimeList Information for ${title} (${type}) `,
        url: url,
        image: {
          url: image_url
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

      return channel.send(discordMangaResponse);
    }
  } catch (err) {
    return channel.send(`\`\`\`${err}\`\`\``);
  }
}
