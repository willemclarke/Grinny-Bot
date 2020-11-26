import Discord from 'discord.js';
import { getStoicQuote } from '../api/stoic';
import _ from 'lodash';

export async function stoicQuote(channel: Discord.TextChannel) {
  try {
    const quote = await getStoicQuote();
    const { text, author } = quote;

    const philosopherImages = {
      marcusAurelius:
        'https://www.biography.com/.image/t_share/MTE5NDg0MDU0ODg3Njk1ODg3/marcus-aurelius-9192657-1-402.jpg',
      seneca: 'https://pbs.twimg.com/profile_images/1305118024081584128/Icr8zl2r_400x400.jpg',
      epictetus: 'https://pbs.twimg.com/profile_images/1305885843031195650/2atRwqJS_400x400.jpg',
    };

    const philosopherLinks = {
      marcusAurelius: 'https://en.wikipedia.org/wiki/Marcus_Aurelius',
      seneca: 'https://en.wikipedia.org/wiki/Seneca_the_Younger',
      epictetus: 'https://en.wikipedia.org/wiki/Epictetus',
    };

    const matchingImage = (author: string): string => {
      if (author === 'Seneca') {
        return philosopherImages.seneca;
      } else if (author === 'Marcus Aurelius') {
        return philosopherImages.marcusAurelius;
      } else if (author === 'Epictetus') {
        return philosopherImages.epictetus;
      }
      return author;
    };

    const matchingPhilosopherLink = (author: string): string => {
      if (author === 'Seneca') {
        return philosopherLinks.seneca;
      } else if (author === 'Marcus Aurelius') {
        return philosopherLinks.marcusAurelius;
      } else if (author === 'Epictetus') {
        return philosopherLinks.epictetus;
      }
      return author;
    };

    const discordQuoteResponse = new Discord.RichEmbed({
      color: 0x7289da,
      timestamp: new Date(),
      author: {
        name: 'GrinnyBot',
        icon_url:
          'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
      },
      thumbnail: {
        url: matchingImage(author),
      },
      description: `"${text}" - [**${author}**](${matchingPhilosopherLink(author)})`,
    });

    await channel.send(discordQuoteResponse);
  } catch (err) {
    console.log(err);
    channel.send(`\`\`\`${err}\`\`\``);
  }
}

export function stoicQuoteInterval(channel: Discord.TextChannel) {
  setInterval(() => {
    stoicQuote(channel);
  }, 1000 * 60 * 60 * 8);
}
