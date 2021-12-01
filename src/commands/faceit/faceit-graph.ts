import Discord from 'discord.js';
import _ from 'lodash';
import { faceit, formatDiscordMessage } from '../..';
import fs, { readFileSync } from 'fs';
import path, { parse } from 'path';

async function getFaceitUserId(
  game: string,
  username: string
): Promise<{ username: string; rating: number; playerId: string }> {
  const userId = await faceit.getGeneralStats(game, username);

  return {
    username: userId.nickname,
    rating: userId.games.csgo.faceit_elo,
    playerId: userId.player_id,
  };
}

async function getFaceitUserElo(playerId: string): Promise<{ username: string; rating: number }> {
  const data = await faceit.getPlayerGraphStats(playerId);

  return {
    username: data.nickname,
    rating: data.games.csgo.faceit_elo,
  };
}

export async function faceitUserData() {
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

  try {
    const users = await Promise.all(promises);

    const playerElos = users.reduce<Record<string, { rating: number; date: Date }>>((acc, user) => {
      return { ...acc, [user.username]: { rating: user.rating, date: new Date() } };
    }, {});

    return [playerElos];
  } catch (error) {
    console.log({ error });
  }
}

export const writeToFile = async () => {
  const filePath = path.join(__dirname, './elo.json');
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    const data = await faceitUserData();
    const writeFile = fs.writeFileSync(filePath, JSON.stringify({ data }, null, 2), {
      flag: 'a+',
    });
  }

  // const parseFile = readFileSync(filePath).toString();
  // console.log({ parseFile });
};
