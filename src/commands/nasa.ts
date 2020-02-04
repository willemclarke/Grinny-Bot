import * as Discord from "discord.js";
import { nasaAPI } from "..";
import * as _ from "lodash";

export function getAstronomyPic(channel: Discord.TextChannel): Promise<Discord.Message | Discord.Message[]> {
  return nasaAPI.getAPOTD().then(nasaResponse => {
    const { copyright, title, url, code, msg } = nasaResponse;
    if (code && code !== 200) {
      channel.send(`\`\`\`${msg}\`\`\``);
    }

    const discordNasaResponse = new Discord.RichEmbed({
      author: {
        name: "GrinnyBot",
        icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
      },
      title: `NASA Astrology Picture of the Day by ${copyright}`,
      color: 0x7289da,
      timestamp: new Date(),
      fields: [
        {
          name: "Title",
          value: `${title}`
        }
      ],
      image: {
        url: url
      }
    });

    return channel.send(discordNasaResponse);
  });
}

export function astronomyPicInterval(channel: Discord.TextChannel) {
  setInterval(() => {
    getAstronomyPic(channel);
  }, 1000 * 60 * 60 * 24);
}
