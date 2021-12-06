import Discord from 'discord.js';
import { getStoicQuote } from '../api/stoic';
import _ from 'lodash';
import { codeblockMsg } from '../utils';
import { GRINNY_BOT_ICON } from '../types/constants';
import { schedule } from 'node-cron';

const philosopherInfo = {
  marcusAurelius: {
    image:
      'https://www.biography.com/.image/t_share/MTE5NDg0MDU0ODg3Njk1ODg3/marcus-aurelius-9192657-1-402.jpg',
    link: 'https://en.wikipedia.org/wiki/Marcus_Aurelius',
  },
  seneca: {
    image:
      'https://www.thoughtco.com/thmb/7BlgoGGgq_eooln3xcXJ3-jYE64=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1048461504-4e7e718691924af9a07bbf4b2b81d72f.jpg',
    link: 'https://en.wikipedia.org/wiki/Seneca_the_Younger',
  },
  epictetus: {
    image:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1507496989i/24121395._SY540_.jpg',
    link: 'https://en.wikipedia.org/wiki/Epictetus',
  },
};

export async function displayStoicQuote(
  channel: Discord.TextChannel
): Promise<Discord.Message | Discord.Message[]> {
  try {
    const quote = await getStoicQuote();
    const { text, author } = quote;

    const matchingData = (philosopher: typeof author) => {
      switch (philosopher) {
        case 'Marcus Aurelius':
          return philosopherInfo.marcusAurelius;
        case 'Epictetus':
          return philosopherInfo.epictetus;
        case 'Seneca':
          return philosopherInfo.seneca;
        default:
          return philosopher;
      }
    };

    const discordQuoteResponse = new Discord.RichEmbed({
      color: 0x7289da,
      timestamp: new Date(),
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      thumbnail: {
        url: matchingData(author).image,
      },
      description: `"${text}" - [**${author}**](${matchingData(author).link})`,
    });

    return await channel.send(discordQuoteResponse);
  } catch (err) {
    return await channel.send(codeblockMsg(`${err}`));
  }
}

export function stoicQuoteInterval(channel: Discord.TextChannel) {
  schedule('0 0 */12 * * *', () => {
    displayStoicQuote(channel);
  });
}
