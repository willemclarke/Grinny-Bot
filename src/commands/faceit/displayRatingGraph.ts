import Discord from 'discord.js';
import _ from 'lodash';
import { GRINNY_BOT_ICON } from '../../types/constants';
import { codeblockMsg, randomString } from '../../utils';
import { faceitDbService } from '../..';
import { plotlyApi } from '../../index';

const layout = {
  title: `Faceit Elos`,
  yaxis: {
    title: 'Elo',
  },
  xaxis: {
    title: 'Date',
  },
  font: {
    size: 14,
  },
};

const imgOpts = {
  format: 'png',
  width: 1200,
  height: 667,
};

const fileName = `${randomString(16)}.png`;

export const displayRatingGraph = async (
  channel: Discord.TextChannel,
  args: string[]
): Promise<Discord.Message | Discord.Message[] | undefined> => {
  try {
    if (_.includes(args, 'force')) {
      await faceitDbService.writePlayerElos();
    }

    const rawData = await faceitDbService.getElosForGraph();
    const transformedData = faceitDbService.transFormGraphData(rawData);
    await plotlyApi.createGraph(transformedData, layout, imgOpts, fileName);

    const imageResp = new Discord.RichEmbed({
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      image: {
        url: `attachment://${fileName}`,
      },
      title: `Line Graph of Faceit Elos`,
      color: 0x7289da,
    });

    await channel.send({
      embed: imageResp,
      files: [{ attachment: fileName, name: fileName }],
    });

    plotlyApi.deleteFile(fileName);
  } catch (error) {
    console.log(error);
    return await channel.send(codeblockMsg(`${error}`));
  }
};
