import Discord from 'discord.js';
import _ from 'lodash';

export function retake(channel: Discord.TextChannel): Promise<Discord.Message | Discord.Message[]> {
  const users = [
    '<@146942726666059776>',
    '<@214186606926626817>',
    '<@295093140501823488>',
    '<@145745079074684928>',
    '<@191320853756116992>',
    '<@209970414556807169>',
  ];
  const mappedUsers = _.map(users, (user) => user);

  return channel.send(`Time for sin!! ${mappedUsers}`);
}
