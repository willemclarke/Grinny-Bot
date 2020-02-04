import * as Discord from "discord.js";
import { nasaAPI } from "..";
import * as _ from "lodash";

export function getAstronomyPic(message: Discord.Message): Promise<Discord.Message | Discord.Message[]> {
  return nasaAPI.getAPOTD().then(nasaResponse => {
    const { copyright, title, url, code, msg } = nasaResponse;
    if (code && code !== 200) {
      message.channel.send(`\`\`\`${msg}\`\`\``);
    }
    console.log(nasaResponse);

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

    return message.channel.send(discordNasaResponse);
  });
}
