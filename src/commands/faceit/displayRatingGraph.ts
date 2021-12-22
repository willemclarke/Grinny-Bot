import Discord from 'discord.js';
import _ from 'lodash';
import { GRINNY_BOT_ICON } from '../../types/constants';
import { codeblockMsg, randomString } from '../../utils';
import { faceitDbService } from '../..';
import { plotlyApi } from '../../index';

export const displayRatingGraph = async (channel: Discord.TextChannel) => {
  const rawData = await faceitDbService.getElosForGraph();
  const parsedData = faceitDbService.transFormGraphData(rawData);

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
  await plotlyApi.createGraph(parsedData, layout, imgOpts, fileName);

  try {
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
    return await channel.send(codeblockMsg(`${error}`));
  }
};
