import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { Faceit } from "./faceit";

config();

const faceitToken: string = process.env.FACEIT_TOKEN;
const faceit = new Faceit(faceitToken);

const discordToken: string = process.env.DISCORD_TOKEN;
const discord = new Discord.Client();
// const pitId: string = "642229195405131776";
const sacredId: string = "524008179861028885";
const prefix: string = "!";

discord.once("ready", () => {
  console.log("Ready!");
  const sacredChannel = discord.channels.get(sacredId) as Discord.TextChannel;
  sacredChannel.send(
    `bot has successfully started up hostname: ${os.hostname}`
  );
});

discord.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args: string[] = message.content.slice(prefix.length).split(" ");
  const command: string = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong.");
  } else if (command === "user-info") {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  } else if (command === "args-info") {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  } else if (command === "stats") {
    return runStatsCommand(message, args);
  }
});

function runStatsCommand(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return message.channel.send(
      `You didn't provide enough arguments: (game, name) are required`
    );
  } else {
    const [game, username] = args;
    faceit.getGeneralStats(game, username).then(stats => {
      const playerId: string = JSON.stringify(stats.player_id);
      console.log(playerId);
      return faceit.getPlayerStats(game, playerId).then(stats => {
        return message.channel.send(
          `We received ${JSON.stringify(stats, null, 2)}`
        );
      });
    });
  }
}

discord.login(discordToken);
