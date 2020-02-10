import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { Faceit } from "./api/faceit";
import { getFaceitStatistics, faceitUserData } from "./commands/faceit";
import { WeatherAPI } from "./api/weather";
import { getWeather } from "./commands/weather";
import { StocksAPI } from "./api/stocks";
import { getIndividualStockData } from "./commands/stocks";
import { NasaAPI } from "./api/nasa";
import { getAstronomyPic, astronomyPicInterval } from "./commands/nasa";
import { UrbanAPI } from "./api/urban";
import { getUrbanDictionaryDefinition } from "./commands/urban";
import { IMDBAPI } from "./api/imdb";
import { getImdbInfo } from "./commands/imdb";

import * as _ from "lodash";

config();

const discordToken: string = process.env.DISCORD_TOKEN;
const discord = new Discord.Client();

const faceitToken: string = process.env.FACEIT_TOKEN;
export const faceit = new Faceit(faceitToken);

const weatherToken: string = process.env.WEATHER_TOKEN;
export const weatherAPI = new WeatherAPI(weatherToken);

const stocksToken: string = process.env.STOCKS_TOKEN;
export const stocksAPI = new StocksAPI(stocksToken);

const nasaToken: string = process.env.NASA_TOKEN;
export const nasaAPI = new NasaAPI(nasaToken);

const urbanToken: string = process.env.URBAN_TOKEN;
export const urbanAPI = new UrbanAPI(urbanToken);

const imdbToken: string = process.env.IMDB_TOKEN;
export const imdbAPI = new IMDBAPI(imdbToken);

const pitId: string = "642229195405131776";
const vipId: string = "444358361098616833";
const prefix: string = "!";

discord.once("ready", () => {
  const pitOfSmithChannel = discord.channels.get(pitId) as Discord.TextChannel;
  const vipChannel = discord.channels.get(vipId) as Discord.TextChannel;
  astronomyPicInterval(vipChannel);
  console.log("Ready!");
  pitOfSmithChannel.send(`\`\`\`Bot has successfully started up on hostname: ${os.hostname}\`\`\``);
});

discord.on("message", message => {
  const { channel } = <{ channel: Discord.TextChannel }>message;
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const splitStringArgs: string[] = message.content.slice(prefix.length).split('"');
  const args: string[] = _.chain(splitStringArgs)
    .flatMap((arg, index) => (index === 0 ? arg.split(" ") : arg))
    .compact()
    .value();
  const command: string = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong.");
  } else if (command === "user-info") {
    message.channel.send(`\`\`\`Your username: ${message.author.username}\nYour ID: ${message.author.id}\`\`\``);
  } else if (command === "help") {
    return displayHelpCommands(channel);
  } else if (command === "stats") {
    return getFaceitStatistics(channel, args);
  } else if (command === "graph") {
    return faceitUserData(channel);
  } else if (command === "weather") {
    return getWeather(channel, args);
  } else if (command === "stocks") {
    return getIndividualStockData(channel, args);
  } else if (command === "nasa") {
    return getAstronomyPic(channel);
  } else if (command === "urban") {
    return getUrbanDictionaryDefinition(channel, args);
  } else if (command === "imdb") {
    return getImdbInfo(channel, args);
  }
});

function displayHelpCommands(channel: Discord.TextChannel): Promise<Discord.Message | Discord.Message[]> {
  const listOfCommands = new Discord.RichEmbed({
    author: {
      name: "GrinnyBot",
      icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg"
    },
    title: "List of Discord Commands",
    color: 0x7289da,
    timestamp: new Date(),
    fields: [
      { name: "!stats", value: "Faceit Statistics Command: requires <!stats csgo Faceit_Name>" },
      {
        name: "!weather",
        value: `Weather Information Command: requires <!weather City_Name>, Cities such as New York require: <!weather "New York">`
      },
      {
        name: "!stocks",
        value: `Stock Market Information Command: requires <!stocks STOCK_SYMBOL> e.g. <!stocks TWTR>`
      },
      {
        name: "!nasa",
        value: `NASA Astronomy Picture of the Day Command: simply requires <!nasa>`
      },
      {
        name: "!urban",
        value: `Urban Dictionary Command: requires <!urban WORD>, spaced words require: <!urban "SPACED WORD">`
      },
      {
        name: "!imdb",
        value: `IMDB Movie/series Information Command: requires <!urban Movie>, spaced words require: <!urban "Spaced Movie/Series">`
      }
    ]
  });

  return channel.send(listOfCommands);
}

export function formatDiscordMessage(object: object): string {
  return _.reduce(object, (acc, value, key) => _.concat(acc, `${key}: ${value}`), []).join("\n");
}

discord.login(discordToken);
