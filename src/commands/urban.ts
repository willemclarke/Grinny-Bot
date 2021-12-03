import Discord from 'discord.js';
import _ from 'lodash';
import { urbanAPI } from '..';

export function displayUrbanDictionaryDefinition(
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return channel.send(
      `\`\`\`You didn't provide enough arguments, requires: <!urban WORD>, spaced words require: <!urban "SPACED WORD">\`\`\``
    );
  } else {
    const [term] = args;

    return urbanAPI
      .getUrbanDictionary(term)
      .then((urbanResponse) => {
        const { word, definition, example, author, written_on, permalink, thumbs_up } =
          urbanResponse.list[0];
        const formattedDate: string = _.slice(written_on, 0, 10).join('').toString();

        const trimDefnition = _.truncate(definition, {
          length: 1024,
          omission: '[...]',
        });

        const discordUrbanResponse = new Discord.RichEmbed({
          author: {
            name: 'GrinnyBot',
            icon_url:
              'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
          },
          title: `Urban Dictionary Definition for:  ${_.upperFirst(word)}`,
          url: `${permalink}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: `**Definition: ${thumbs_up} Upvotes**`,
              value: trimDefnition,
              inline: true,
            },
            {
              name: '**Example**',
              value: example,
            },
            {
              name: '**Author**',
              value: author,
            },
            {
              name: '**Written on**',
              value: formattedDate,
            },
          ],
        });

        return channel.send(discordUrbanResponse);
      })
      .catch((error) => {
        return channel.send(`\`\`\`${error}\`\`\``);
      });
  }
}
