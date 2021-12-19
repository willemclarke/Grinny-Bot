import Discord from 'discord.js';
import _ from 'lodash';
import { GRINNY_BOT_ICON } from '../../types/constants';
import { codeblockMsg } from '../../utils';
import QuickChart from 'quickchart-js';
import { faceitDbService } from '../..';

export const displayRatingGraph = async (channel: Discord.TextChannel, args: string[]) => {
  const rawData = await faceitDbService.getElosForGraph();
  const parsedData = faceitDbService.transFormGraphData(rawData);

  const chart = new QuickChart();
  const config = chart
    .setConfig({
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [93, -29, -17, -8, 73, 98, 40],
            fill: false,
          },
          {
            label: 'My Second dataset',
            fill: false,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: [20, 85, -79, 93, 27, -81, -22],
          },
          {
            label: 'My third dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [20, 42, 35, 36, 37, -22, -10],
            fill: false,
          },
          {
            label: 'My 4th dataset',
            fill: false,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: [20, 53, 21, -20, 5, 8, 9],
          },
        ],
      },
    })
    .setWidth(900)
    .setHeight(600);
  try {
    const url = await chart.getShortUrl();
    const imageResp = new Discord.RichEmbed({
      author: {
        name: 'GrinnyBot',
        icon_url: GRINNY_BOT_ICON,
      },
      title: `Line Graph of Faceit Elos`,
      color: 0x7289da,
      image: {
        url,
      },
    });
    return await channel.send(imageResp);
  } catch (error) {
    return await channel.send(codeblockMsg(`${error}`));
  }
};
