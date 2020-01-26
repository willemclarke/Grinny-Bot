import * as Discord from "discord.js";
import * as _ from "lodash";
import { formatDiscordMessage, stocksAPI } from "..";

export function getIndividualStockData(message: Discord.Message, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return message.channel.send(
      `\`\`\`You didn't provide enough arguments, requires: <!stocks STOCKSYMBOL>, e.g. <!stocks TWTR>\`\`\``
    );
  } else {
    const [symbol] = args;

    stocksAPI
      .getStockData(symbol)
      .then(stockResponse => {
        const data = stockResponse.data[0];
        const discordStocksResponse = new Discord.RichEmbed({
          author: {
            name: "GrinnyBot",
            icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
          },
          title: `Stock Data for ${data.name} --> ${data.symbol}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: "Current Price",
              value: `$${data.price}`
            },
            {
              name: "Opening Price",
              value: `$${data.price_open}`
            },
            {
              name: "Days Lowest Price",
              value: `$${data.day_low}`
            },
            {
              name: "Days Highest Price",
              value: `$${data.day_high}`
            },
            {
              name: "52 Week Highest Price",
              value: `$${data["52_week_high"]}`
            },
            {
              name: "52 Week Lowest Price",
              value: `$${data["52_week_low"]}`
            },
            {
              name: "Yesterdays Closing Price",
              value: `$${data.close_yesterday}`
            },
            {
              name: "Current Market Cap",
              value: `$${data.market_cap}`
            },
            {
              name: "Earnings Per Share",
              value: `$${data.eps}`
            },
            {
              name: "Average Trading Volume",
              value: `${data.volume_avg} Shares`
            },
            {
              name: "Trading On",
              value: `${data.stock_exchange_long} --> ${data.stock_exchange_short}`
            }
          ]
        });

        return message.channel.send(discordStocksResponse);
      })
      .catch(error => {
        return message.channel.send(`\`\`\`${error}\`\`\``);
      });
  }
}
