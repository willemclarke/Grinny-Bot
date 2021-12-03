import Discord from 'discord.js';
import _ from 'lodash';
import { nasaApi } from '..';
import { GRINNY_BOT_ICON } from '../types/constants';
import { codeblockMsg } from '../utils';

export const displayAstronomyPic = async (
  channel: Discord.TextChannel
): Promise<void | Discord.Message | Discord.Message[]> => {
  try {
    const nasaData = await nasaApi.getNasaData();
    const { copyright, title, url, code, msg, explanation } = nasaData;

    if (code && code !== 200) {
      channel.send(`\`\`\`${msg}\`\`\``);
    }

    const checkCopyright = copyright ? copyright : 'Unknown';
    const trimExplanation: string = _.truncate(explanation, {
      length: 600,
      omission: '[...]',
    });

    const discordNasaResponse = new Discord.RichEmbed({
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      title: `NASA Astronomy Picture of the Day`,
      color: 0x7289da,
      timestamp: new Date(),
      fields: [
        {
          name: '**Title**',
          value: `${title} by ${checkCopyright}`,
        },
        {
          name: '**Explanation**',
          value: trimExplanation,
        },
      ],
      image: {
        url: url,
      },
    });

    return await channel.send(discordNasaResponse);
  } catch (err) {
    return await channel.send(codeblockMsg(`${err}`));
  }
};

export function astronomyPicInterval(channel: Discord.TextChannel) {
  setInterval(() => {
    displayAstronomyPic(channel);
  }, 1000 * 60 * 60 * 24);
}
