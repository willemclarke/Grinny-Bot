import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { getFaceitStatistics, faceitUserData } from "./commands/faceit";
import { getWeather } from "./commands/weather";
import { getIndividualStockData } from "./commands/stocks";
import * as _ from "lodash";

config();

const discordToken: string = process.env.DISCORD_TOKEN;
const discord = new Discord.Client();
const pitId: string = "642229195405131776";
const prefix: string = "!";

discord.once("ready", () => {
  console.log("Ready!");
  const pitOfSmithChannel = discord.channels.get(pitId) as Discord.TextChannel;
  pitOfSmithChannel.send(`\`\`\`Bot has successfully started up hostname: ${os.hostname}\`\`\``);
});

discord.on("message", message => {
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
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  } else if (command === "help") {
    return displayHelpCommands(message);
  } else if (command === "stats") {
    return getFaceitStatistics(message, args);
  } else if (command === "weather") {
    return getWeather(message, args);
  } else if (command === "stocks") {
    return getIndividualStockData(message, args);
  } else if (command === "graph") {
    return faceitUserData(message);
  }
});

function displayHelpCommands(message: Discord.Message): Promise<Discord.Message | Discord.Message[]> {
  const listOfCommands = new Discord.RichEmbed({
    author: {
      name: "Smithoath",
      icon_url:
        "https://vignette.wikia.nocookie.net/harrypotter/images/e/e3/Gringotts_Head_Goblin.jpg/revision/latest?cb=20100214234030"
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
      }
    ]
  });

  return message.channel.send(listOfCommands);
}

export function formatDiscordMessage(object: object): string {
  return _.reduce(object, (acc, value, key) => _.concat(acc, `${key}: ${value}`), []).join("\n");
}

discord.login(discordToken);
