import Discord from 'discord.js';
import _ from 'lodash';
import { getStoicQuote } from '../api/stoic'

export async function stoicQuote(channel: Discord.TextChannel) {
  try {
      const quote = await getStoicQuote()
      const { text, author } = quote

      const discordQuoteResponse = new Discord.RichEmbed({
        color: 0x7289da,
        timestamp: new Date(),
        author: {
          name: 'GrinnyBot',
          icon_url:
            'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
        },
        thumbnail: {
          url: 'https://www.biography.com/.image/t_share/MTE5NDg0MDU0ODg3Njk1ODg3/marcus-aurelius-9192657-1-402.jpg'
        },
        description: `"${text}" - **${author}**`
      })

      await channel.send(discordQuoteResponse)
    
  } catch (err) {
    console.log(err)
    channel.send(`\`\`\`${err}\`\`\``)
  }
}

