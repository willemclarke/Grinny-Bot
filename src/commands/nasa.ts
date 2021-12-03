import Discord from 'discord.js';
import _ from 'lodash';
import { nasaAPI } from '..';

export function displayAstronomyPic(
  channel: Discord.TextChannel
): Promise<void | Discord.Message | Discord.Message[]> {
  return nasaAPI
    .getAPOTD()
    .then((nasaResponse) => {
      const { copyright, title, url, code, msg, explanation } = nasaResponse;
      if (code && code !== 200) {
        channel.send(`\`\`\`${msg}\`\`\``);
      }

      const checkCopyright = copyright ? copyright : 'Unknown';
      const trimExplanation: string = _.truncate(explanation, {
        length: 1024,
        omission: '[...]',
      });

      const discordNasaResponse = new Discord.RichEmbed({
        author: {
          name: 'GrinnyBot',
          icon_url:
            'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
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

      return channel.send(discordNasaResponse);
    })
    .catch((error) => {
      console.log(error);
      channel.send(`\`\`\`${error}\`\`\``);
    });
}

export function astronomyPicInterval(channel: Discord.TextChannel) {
  setInterval(() => {
    displayAstronomyPic(channel);
  }, 1000 * 60 * 60 * 24);
}
