import * as Discord from "discord.js";
import * as _ from "lodash";
import { formatDiscordMessage } from "..";
import { StocksAPI } from "../api/stocks";

const stocksToken: string = process.env.STOCKS_TOKEN;
const stocksAPI = new StocksAPI(stocksToken);

export function getIndividualStockData(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return message.channel.send(
      `\`\`\`You didn't provide enough arguments, requires: <!stocks STOCKSYMBOL>, e.g. <!stocks TWTR>\`\`\``
    );
  } else {
    const [symbol] = args;

    stocksAPI
      .getStockData(symbol)
      .then(stockResponse => {
        console.log(stockResponse);
        const data = stockResponse.data[0];
        const discordResponseStockData = {
          "Stock Name & Symbol": `${data.name} & ${data.symbol}`,
          "Current Price": `$${data.price}`,
          "Opening Price": `$${data.price_open}`,
          "Days Lowest Price": `$${data.day_low}`,
          "Days Highest Price": `$${data.day_high}`,
          "52 Week Highest Price": `$${data["52_week_high"]}`,
          "52 Week Lowest Price": `$${data["52_week_low"]}`,
          "Yesterdays Closing Price": `$${data.close_yesterday}`,
          "Market Capitalization": `$${data.market_cap}`,
          "Earnings Per Share": `$${data.eps}`,
          "Average Trading Volume": `${data.volume_avg}`,
          "Trading On": `${data.stock_exchange_long} AKA ${data.stock_exchange_short}`
        };

        const formattedStockData = formatDiscordMessage(discordResponseStockData);
        return message.channel.send(`Stock Data for ${symbol}: \`\`\`${formattedStockData}\`\`\``);
      })
      .catch(error => {
        return message.channel.send(`\`\`\`${error}\`\`\``);
      });
  }
}
