import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";

const request = require("request");

config();
const token: string = process.env.DISCORD_TOKEN;
const faceitToken: string = process.env.FACEIT_TOKEN;
const client = new Discord.Client();
const sacredId: string = "524008179861028885";
const prefix: string = "!";

client.once("ready", () => {
  console.log("Ready!");
  const sacredChannel = client.channels.get(sacredId) as Discord.TextChannel;
  sacredChannel.send(`bot has successfully started up hostname: ${os.hostname}`);
});

client.on("message", message => {
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
  }
});

client.login(token);

// function runStatsCommand(args: string[]) {
//   if (!args.length) {
//       return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
//   } else {
//       const name = args[0]
//       return message.channel.send("No stats for " + name + " just yet");
//   }
// }

// const test = request.get("https://developers.faceit.com/docs/tools/data-api", {
//   auth: {
//     bearer: `${faceitToken}`
//   }
// });
