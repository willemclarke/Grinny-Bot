import Discord from "discord.js";
import _ from "lodash";
import { stocksAPI } from "..";

export function getIndividualStockData(channel: Discord.TextChannel, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return channel.send(`\`\`\`You didn't provide enough arguments, requires: <!stocks STOCKSYMBOL>, e.g. <!stocks TWTR>\`\`\``);
  } else {
    const [symbol] = args;

    return stocksAPI
      .getStockData(symbol)
      .then((stockResponse) => {
        if (stockResponse.Message) {
          return channel.send(`\`\`\`${stockResponse.Message} --> Make sure !stocks <STOCK_SYMBOL_IS_CORRECT!>\`\`\``);
        }
        const data = stockResponse.data[0];
        const discordStocksResponse = new Discord.RichEmbed({
          author: {
            name: "GrinnyBot",
            icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg",
          },
          title: `Stock Data for ${data.name} --> ${data.symbol}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: "Current Price",
              value: `$${data.price}`,
            },
            {
              name: "Opening Price",
              value: `$${data.price_open}`,
            },
            {
              name: "Days Lowest Price",
              value: `$${data.day_low}`,
            },
            {
              name: "Days Highest Price",
              value: `$${data.day_high}`,
            },
            {
              name: "52 Week Highest Price",
              value: `$${data["52_week_high"]}`,
            },
            {
              name: "52 Week Lowest Price",
              value: `$${data["52_week_low"]}`,
            },
            {
              name: "Yesterdays Closing Price",
              value: `$${data.close_yesterday}`,
            },
            {
              name: "Current Market Cap",
              value: `$${data.market_cap}`,
            },
            {
              name: "Earnings Per Share",
              value: `$${data.eps}`,
            },
            {
              name: "Average Trading Volume",
              value: `${data.volume_avg} Shares`,
            },
            {
              name: "Trading On",
              value: `${data.stock_exchange_long} --> ${data.stock_exchange_short}`,
            },
          ],
        });

        return channel.send(discordStocksResponse);
      })
      .catch((error) => {
        return channel.send(`\`\`\`${error}\`\`\``);
      });
  }
}
