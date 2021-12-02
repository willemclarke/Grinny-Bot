import Discord from 'discord.js';
import _ from 'lodash';
import { faceit } from '../..';

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
      if (_.head(playerDetails.errors)?.http_status !== 200) {
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
