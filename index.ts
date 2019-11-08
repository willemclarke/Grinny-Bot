import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";

config();
const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client();
const sacredId = "524008179861028885";

client.once("ready", () => {
  console.log("Ready!");
  const sacredChannel = client.channels.get(sacredId) as Discord.TextChannel;
  sacredChannel.send(`bot has successfully started up hostname: ${os.hostname}`);
});

client.on("message", message => {
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
});

client.login(token);
