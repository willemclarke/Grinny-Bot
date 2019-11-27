import { config } from "dotenv";
import * as Discord from "discord.js";
import * as os from "os";
import { Faceit } from "./faceit";
import { WeatherAPI, WeatherResponse } from "./weather";
import * as _ from "lodash";

config();

const faceitToken: string = process.env.FACEIT_TOKEN;
const faceit = new Faceit(faceitToken);

const weatherToken: string = process.env.WEATHER_TOKEN;
const weatherAPI = new WeatherAPI(weatherToken);

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
    return getAndRunFaceitStatistics(message, args);
  } else if (command === "weather") {
    return getAndDisplayWeather(message, args);
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
      }
    ]
  });
  // `\`\`\`${formattedListOfCommands}\`\`\``
  return message.channel.send(listOfCommands);
}

function getAndRunFaceitStatistics(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return message.channel.send(`You didn't provide enough arguments: requires: !stats csgo <faceit_alias>`);
  } else {
    const [game, username] = args;

    faceit.getGeneralStats(game, username).then(playerDetails => {
      const { player_id, games } = playerDetails;
      const { skill_level_label, faceit_elo } = games.csgo;

      return faceit.getPlayerStats(player_id, game).then(playerStats => {
        const discordStatsResponse = new Discord.RichEmbed({
          author: {
            name: "Smithoath",
            icon_url:
              "https://vignette.wikia.nocookie.net/harrypotter/images/e/e3/Gringotts_Head_Goblin.jpg/revision/latest?cb=20100214234030"
          },
          title: `Statistics for ${username}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: "Faceit Level",
              value: skill_level_label
            },
            {
              name: "Rating",
              value: faceit_elo
            },
            {
              name: "Matches Played",
              value: playerStats.lifetime.Matches
            },
            {
              name: "Win Rate",
              value: `${playerStats.lifetime["Win Rate %"]}%`
            },
            {
              name: "Longest Win Streak",
              value: playerStats.lifetime["Longest Win Streak"]
            },
            {
              name: "K/D Ratio",
              value: playerStats.lifetime["Average K/D Ratio"]
            },
            {
              name: "Headshot %",
              value: `${playerStats.lifetime["Average Headshots %"]}%`
            }
          ],
          footer: {
            text: "Forgive me for I have sinned"
          }
        });

        return message.channel.send(discordStatsResponse);
      });
    });
  }
}

function getAndDisplayWeather(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (!args.length) {
    return message.channel.send(
      `You didnt provide enough arguments: !weather <city_name> is required, Cities with more than one word names require ""`
    );
  } else {
    const [cityName] = args;

    weatherAPI.getWeather(cityName).then(weatherDetails => {
      if (weatherDetails.cod !== 200) {
        return message.channel.send(_.upperFirst(weatherDetails.message || "Unknown error occured"));
      }
      const mainTempCelcius: number = Math.round(weatherDetails.main.temp - 273.15);
      const minTempCelcius: number = Math.round(weatherDetails.main.temp_min - 273.15);
      const maxTempCelcius: number = Math.round(weatherDetails.main.temp_max - 273.15);
      const windSpeedKmh: number = Math.round(weatherDetails.wind.speed * 1.852);

      const discordWeatherResponse = new Discord.RichEmbed({
        author: {
          name: "Smithoath",
          icon_url:
            "https://vignette.wikia.nocookie.net/harrypotter/images/e/e3/Gringotts_Head_Goblin.jpg/revision/latest?cb=20100214234030"
        },
        title: `Weather for ${cityName}`,
        color: 0x7289da,
        timestamp: new Date(),
        fields: [
          {
            name: "Weather Conditions",
            value: weatherDetails.weather[0]["description"]
          },
          {
            name: "Temperature",
            value: `${mainTempCelcius}°C`
          },
          {
            name: "Minimum Temperature",
            value: `${minTempCelcius}°C`
          },
          {
            name: "Maximum Temperature",
            value: `${maxTempCelcius}°C`
          },
          {
            name: "Visibility",
            value: `${weatherDetails.visibility}`
          },
          {
            name: "Wind Speed",
            value: `${windSpeedKmh} Km/h`
          }
        ]
      });

      // using codeblock === `\`\`\`${discordWeatherResponse}\`\`\``
      return message.channel.send(discordWeatherResponse);
    });
  }
}

function formatDiscordMessage(object: object): string {
  return _.reduce(object, (acc, value, key) => _.concat(acc, `${key}: ${value}`), []).join("\n");
}

discord.login(discordToken);
