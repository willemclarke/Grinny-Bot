import Discord from 'discord.js';
import _ from 'lodash';
import { GRINNY_BOT_ICON } from '../../types/constants';
import { codeblockMsg } from '../../utils';

export const displayRatingGraph = async (channel: Discord.TextChannel, args: string[]) => {
  try {
  } catch (error) {
    return await channel.send(codeblockMsg(`${error}`));
  }
};
