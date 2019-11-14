import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { Faceit } from "./faceit";

config();

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
    return runStatsCommand(message, args);
  }
});

function runStatsCommand(message: Discord.Message, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return message.channel.send(`You didn't provide enough arguments: (game, name) are required`);
  } else {
    const [game, username] = args;
    faceit.getGeneralStats(game, username).then(stats => {
      console.log(JSON.stringify(stats));
      const playerId: string = stats.player_id;
      const faceitLevel: string = stats.games.csgo.skill_level.toString();
      const faceitElo: string = stats.games.csgo.faceit_elo.toString();
      return faceit.getPlayerStats(playerId, game).then(stats => {
        console.log(faceitLevel, faceitElo);
        const discordResponse: Object = {
          "Faceit level": faceitLevel,
          Rating: faceitElo,
          "Matches Played": stats.lifetime.Matches,
          "Win Rate": stats.lifetime["Win Rate %"],
          "Longest Win Streak": stats.lifetime["Longest Win Streak"],
          "K/D Ratio": stats.lifetime["Average K/D Ratio"],
          "Headshot %": stats.lifetime["Average Headshots %"]
        };
        return message.channel.send(`Statistics for ${username}: ${JSON.stringify(discordResponse, null, 2)}`);
      });
    });
  }
}

discord.login(discordToken);
