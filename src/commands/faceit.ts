import Discord from "discord.js";
import _ from "lodash";
import { formatDiscordMessage, faceit } from "..";

export function getFaceitStatistics(channel: Discord.TextChannel, args: string[]): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return channel.send(`\`\`\`You didn't provide enough arguments: requires: !stats csgo <faceit_alias>\`\`\``);
  } else {
    const [game, username] = args;

    return faceit.getGeneralStats(game, username).then((playerDetails) => {
      if (playerDetails.errors && playerDetails.errors[0].http_status !== 200) {
        return channel.send(`\`\`\`${playerDetails.errors[0].message} --> Make sure !stats csgo <faceit_alias_is_correct!>\`\`\``);
      }

      const { player_id, games } = playerDetails;
      const { skill_level_label, faceit_elo } = games.csgo;
      const faceitEloString = faceit_elo.toString();

      return faceit.getPlayerStats(player_id, game).then((playerStats) => {
        const discordStatsResponse = new Discord.RichEmbed({
          author: {
            name: "GrinnyBot",
            icon_url: "https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg",
          },
          title: `Statistics for ${username}`,
          url: `https://www.faceit.com/en/players/${username}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: "Faceit Level",
              value: skill_level_label,
            },
            {
              name: "Rating",
              value: faceitEloString,
            },
            {
              name: "Matches Played",
              value: playerStats.lifetime.Matches,
            },
            {
              name: "Win Rate",
              value: `${playerStats.lifetime["Win Rate %"]}%`,
            },
            {
              name: "Longest Win Streak",
              value: playerStats.lifetime["Longest Win Streak"],
            },
            {
              name: "K/D Ratio",
              value: playerStats.lifetime["Average K/D Ratio"],
            },
            {
              name: "Headshot %",
              value: `${playerStats.lifetime["Average Headshots %"]}%`,
            },
          ],
        });

        return channel.send(discordStatsResponse);
      });
    });
  }
}

function getFaceitUser(game: string, username: string): Promise<{ username: string; rating: number }> {
  return faceit.getGeneralStats(game, username).then((playerDetails) => {
    return { username: playerDetails.nickname, rating: playerDetails.games.csgo.faceit_elo };
  });
}

export function faceitUserData(channel: Discord.TextChannel) {
  const promises = [
    getFaceitUser("csgo", "m00sebreeder"),
    getFaceitUser("csgo", "street_rat"),
    getFaceitUser("csgo", "flickzy"),
    getFaceitUser("csgo", "donaldo_desu"),
    getFaceitUser("csgo", "Texta"),
    getFaceitUser("csgo", "sethleeson"),
    getFaceitUser("csgo", "treena"),
    getFaceitUser("csgo", "InfrequeNt"),
    getFaceitUser("csgo", "mswagbabyy"),
    getFaceitUser("csgo", "dbousamra"),
  ];

  return Promise.all(promises)
    .then((users) => {
      const playerElos = _.reduce(
        users,
        (acc, user) => {
          return { ...acc, [user.username]: user.rating };
        },
        {}
      );
      const formattedPlayerElos = formatDiscordMessage(playerElos);
      return channel.send(`\`\`\`${formattedPlayerElos}\`\`\``);
    })
    .catch((error) => {
      channel.send(`\`\`\`${error}\`\`\``);
    });
}
