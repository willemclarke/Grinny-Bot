import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { Faceit } from "./faceit";

config();

const _ = require("lodash");
const faceitToken: string = process.env.FACEIT_TOKEN;
const faceit = new Faceit(faceitToken);

const discordToken: string = process.env.DISCORD_TOKEN;
const discord = new Discord.Client();
const pitId: string = "642229195405131776";
const prefix: string = "!";

discord.once("ready", () => {
  console.log("Ready!");
  const pitOfSmithChannel = discord.channels.get(pitId) as Discord.TextChannel;
  pitOfSmithChannel.send(`bot has successfully started up hostname: ${os.hostname}`);
});

discord.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args: string[] = message.content.slice(prefix.length).split(" ");
  const command: string = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong.");
  } else if (command === "user-info") {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  } else if (command === "args-info") {
    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  } else if (command === "stats") {
    return getAndRunFaceitStatistics(message, args);
  }
});

function getAndRunFaceitStatistics(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return message.channel.send(
      `You didn't provide enough arguments: (game (e.g. csgo), name (faceit)) are required`
    );
  } else {
    const [game, username] = args;

    faceit.getGeneralStats(game, username).then(playerDetails => {
      const { player_id, games } = playerDetails;
      const { skill_level_label, faceit_elo } = games.csgo;

      return faceit.getPlayerStats(player_id, game).then(playerStats => {
        const discordResponse: object = {
          "Faceit Level": skill_level_label,
          Rating: faceit_elo,
          "Matches Played": playerStats.lifetime.Matches,
          "Win Rate": `${playerStats.lifetime["Win Rate %"]}%`,
          "Longest Win Streak": playerStats.lifetime["Longest Win Streak"],
          "K/D Ratio": playerStats.lifetime["Average K/D Ratio"],
          "Headshot %": `${playerStats.lifetime["Average Headshots %"]}%`
        };
        const formattedObject = formatDiscordMessage(discordResponse);
        return message.channel.send(`Statistics for ${username}:` + `\`\`\`${formattedObject}\`\`\``);
      });
    });
  }
}

function formatDiscordMessage(object: object): object {
  return _.reduce(object, (acc, value, key) => _.concat(acc, `${key}: ${value}`), []).join("\n");
}

discord.login(discordToken);
