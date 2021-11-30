import Discord from 'discord.js';
import _ from 'lodash';
import { formatDiscordMessage, faceit } from '..';

export function getFaceitStatistics(
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> {
  if (args.length !== 2) {
    return channel.send(
      `\`\`\`You didn't provide enough arguments: requires: !stats csgo <faceit_alias>\`\`\``
    );
  } else {
    const [game, username] = args;

    return faceit.getGeneralStats(game, username).then((playerDetails) => {
      if ( _.head(playerDetails.errors)?.http_status !== 200) {
        return channel.send(
          `\`\`\`${playerDetails.errors[0].message} --> Make sure !stats csgo <faceit_alias_is_correct!>\`\`\``
        );
      }

      const { player_id, games } = playerDetails;
      const { skill_level_label, faceit_elo } = games.csgo;
      const faceitEloString = faceit_elo.toString();

      return faceit.getPlayerStats(player_id, game).then((playerStats) => {
        const discordStatsResponse = new Discord.RichEmbed({
          author: {
            name: 'GrinnyBot',
            icon_url:
              'https://66.media.tumblr.com/ba12736d298c09db7e4739428a23f8ab/tumblr_pki4rks2wq1tnbbg0_400.jpg',
          },
          title: `Statistics for ${username}`,
          url: `https://www.faceit.com/en/players/${username}`,
          color: 0x7289da,
          timestamp: new Date(),
          fields: [
            {
              name: '**Faceit Level**',
              value: skill_level_label,
            },
            {
              name: '**Rating**',
              value: faceitEloString,
            },
            {
              name: '**Matches Played**',
              value: playerStats.lifetime.Matches,
            },
            {
              name: '**Win Rate**',
              value: `${playerStats.lifetime['Win Rate %']}%`,
            },
            {
              name: '**Longest Win Streak**',
              value: playerStats.lifetime['Longest Win Streak'],
            },
            {
              name: '**K/D Ratio**',
              value: playerStats.lifetime['Average K/D Ratio'],
            },
            {
              name: '**Headshot %**',
              value: `${playerStats.lifetime['Average Headshots %']}%`,
            },
          ],
        });

        return channel.send(discordStatsResponse);
      });
    });
  }
}

async function getFaceitUserId(
  game: string,
  username: string
): Promise<{ username: string; rating: number; playerId: string }> {
  const userId = await faceit.getGeneralStats(game, username)

  return {
    username: userId.nickname,
    rating: userId.games.csgo.faceit_elo,
    playerId: userId.player_id
  }
}

async function getFaceitUserElo(playerId: string): Promise<{ username: string; rating: number }> {
  const data = await faceit.getPlayerGraphStats(playerId)

  return {
    username: data.nickname,
    rating: data.games.csgo.faceit_elo
  }
}

export async function faceitUserData(
  channel: Discord.TextChannel
): Promise<void | Discord.Message | Discord.Message[]> {
  const promises = [
    getFaceitUserElo('1b6a7877-766e-4dd6-9ef4-68c1b8e9d9ce'), // willem
    getFaceitUserElo('f613a6d8-9ddb-419d-9f22-66ad38c43f3c'), // bass
    getFaceitUserElo('d3029d03-5908-4669-b93a-4cbb0afbfe9f'), // flickz
    getFaceitUserElo('f341d26d-9f2d-4e5d-a013-22d461572208'), // richie
    getFaceitUserElo('85a79c9a-c080-4dfe-b424-c8b559b53462'), // texta
    getFaceitUserElo('4cbdb274-a1ed-4a44-9163-29418084f943'), // treena
    getFaceitUserElo('eb5430b6-1b4f-4279-8ae5-3b60da1491ee'), // jesse
    getFaceitUserElo('f4b78c04-5893-4144-b57b-542ee392fc6d'), // mitch
    getFaceitUserElo('802f15e7-da6c-4ce9-82ab-e9e7e877bd76'), // dbou
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
