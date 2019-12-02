import * as Discord from "discord.js";
import { Faceit, FaceitBasicResponse, FaceitIndividualResponse } from "../api/faceit";
import { formatDiscordMessage } from "..";
import * as _ from "lodash";

const faceitToken: string = process.env.FACEIT_TOKEN;
const faceit = new Faceit(faceitToken);

const plotlyToken: string = process.env.PLOTLY_TOKEN;
const plotlyUser: string = process.env.PLOTLY_USERNAME;

export function getFaceitStatistics(
  message: Discord.Message,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return message.channel.send(
      `\`\`\`You didn't provide enough arguments: requires: !stats csgo <faceit_alias>\`\`\``
    );
  } else {
    const [game, username] = args;

    faceit.getGeneralStats(game, username).then(playerDetails => {
      console.log("GET GENERAL STATS" + playerDetails);
      const { player_id, games } = playerDetails;
      const { skill_level_label, faceit_elo } = games.csgo;
      const faceitEloString = faceit_elo.toString();

      return faceit.getPlayerStats(player_id, game).then(playerStats => {
        const discordStatsResponse = new Discord.RichEmbed({
          author: {
            name: "Smithoath",
            icon_url:
              "https://vignette.wikia.nocookie.net/harrypotter/images/e/e3/Gringotts_Head_Goblin.jpg/revision/lafaceitEloString?cb=20100214234030"
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
              value: faceitEloString
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

function getFaceitUser(game: string, username: string): Promise<{ username: string; rating: number }> {
  return faceit.getGeneralStats(game, username).then(playerDetails => {
    console.log("GETFACEITUSER" + playerDetails);
    return { username: playerDetails.nickname, rating: playerDetails.games.csgo.faceit_elo };
  });
}

export function faceitUserData(message: Discord.Message) {
  const promises = [
    getFaceitUser("csgo", "m00sebreeder"),
    getFaceitUser("csgo", "Jidox"),
    getFaceitUser("csgo", "wetstickyman"),
    getFaceitUser("csgo", "Texta"),
    getFaceitUser("csgo", "treena"),
    getFaceitUser("csgo", "InfrequeNt"),
    getFaceitUser("csgo", "mswagbabyy"),
    getFaceitUser("csgo", "dbousamra")
  ];

  return Promise.all(promises).then(users => {
    const playerElos = _.reduce(
      users,
      (acc, user) => {
        return { ...acc, [user.username]: user.rating };
      },
      {} // <-- = acc
    );
    const test = formatDiscordMessage(playerElos);
    return message.channel.send(`\`\`\`${test}\`\`\``);
  });
}
