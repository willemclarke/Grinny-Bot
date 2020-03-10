import * as Discord from "discord.js";
import * as _ from "lodash";
import { getAnimeManga, MediumType } from "../api/myanimelist";

interface Field {
  name: string;
  value: string;
}

export function getAnimeAndMangaInfo(
  channel: Discord.TextChannel,
  command: MediumType,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return channel.send(
      `\`\`\`You didn't provide enough arguments: requires: <!anime/manga anime_title>, spaced anime/manga names require: <!anime/manga "anime/manga_title">\`\`\``
    );
  } else {
    const [title] = args;

    getAnimeManga(command, title)
      .then(myAnimeListResponse => {
        const {
          mal_id,
          url,
          image_url,
          synopsis,
          title,
          type,
          episodes,
          chapters,
          members,
          score,
          airing,
          publishing
        } = myAnimeListResponse.results[0];

        const formattedAiringStatus: Field =
          command === MediumType.anime && airing === false
            ? { name: "**Status**", value: "Finished Airing" }
            : { name: "**Status**", value: "Currently Airing" };

        const formattedPublishingStatus: Field =
          command === MediumType.manga && publishing === false
            ? { name: "**Status**", value: "Finished" }
            : { name: "**Status**", value: "Publishing" };

        const displayCorrectStatus: Field = command === MediumType.anime ? formattedAiringStatus : formattedPublishingStatus;

        const formattedChapters: Field =
          command === MediumType.manga && chapters === 0
            ? { name: "**Chapters**", value: "Unknown" }
            : { name: "**Chapters**", value: `${chapters}` };

        const displayEpisodesOrChapters: Field =
          command === MediumType.anime ? { name: "**Episodes**", value: `${episodes}` } : formattedChapters;

        const discordAnimeMangaResponse = new Discord.RichEmbed({
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
            displayCorrectStatus,
            displayEpisodesOrChapters
          ]
        });

        return channel.send(discordAnimeMangaResponse);
      })
      .catch(error => {
        return channel.send(`\`\`\`${error}\`\`\``);
      });
  }
}
