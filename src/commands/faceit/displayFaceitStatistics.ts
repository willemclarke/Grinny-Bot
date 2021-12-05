import Discord from 'discord.js';
import _ from 'lodash';
import { faceitApi } from '../..';
import { GRINNY_BOT_ICON } from '../../types/constants';
import { codeblockMsg } from '../../utils';

export const displayFaceitStatistics = async (
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[]> => {
  if (args.length !== 2) {
    return channel.send(
      codeblockMsg("You didn't provide enough arguments: requires: !stats csgo <faceit_alias>")
    );
  }
  const [game, username] = args;

  try {
    const generalStats = await faceitApi.getGeneralPlayerStats(game, username);

    const { player_id, nickname, avatar, games } = generalStats;
    const { skill_level, faceit_elo } = games.csgo;

    const playerStats = await faceitApi.getNarrowPlayerStats(player_id, game);

    const discordStatsResponse = new Discord.RichEmbed({
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      title: `Statistics for ${nickname}`,
      url: `https://www.faceit.com/en/players/${nickname}`,
      color: 0x7289da,
      thumbnail: {
        url: avatar,
      },
      timestamp: new Date(),
      fields: [
        {
          name: '**Faceit Level**',
          value: skill_level.toString(),
        },
        {
          name: '**Rating**',
          value: faceit_elo.toString(),
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

    return await channel.send(discordStatsResponse);
  } catch (error) {
    return await channel.send(
      codeblockMsg(`${error} --> Make sure !stats csgo <faceit_alias_is_correct!>`)
    );
  }
};
