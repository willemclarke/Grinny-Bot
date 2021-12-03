import _ from 'lodash';
import { faceitApi } from '../..';

async function getFaceitUserId(
  game: string,
  username: string
): Promise<{ username: string; rating: number; playerId: string }> {
  const userId = await faceitApi.getGeneralStats(game, username);

  return {
    username: userId.nickname,
    rating: userId.games.csgo.faceit_elo,
    playerId: userId.player_id,
  };
}

async function getFaceitUserElo(playerId: string): Promise<{ username: string; rating: number }> {
  const data = await faceitApi.getPlayerGraphStats(playerId);

  return {
    username: data.nickname,
    rating: data.games.csgo.faceit_elo,
  };
}

export async function faceitUserData() {
  const promises = [
    getFaceitUserElo('1b6a7877-766e-4dd6-9ef4-68c1b8e9d9ce'), // willem
    getFaceitUserElo('f613a6d8-9ddb-419d-9f22-66ad38c43f3c'), // bass
    getFaceitUserElo('f341d26d-9f2d-4e5d-a013-22d461572208'), // richie
    getFaceitUserElo('802f15e7-da6c-4ce9-82ab-e9e7e877bd76'), // dbou
  ];

  try {
    const users = await Promise.all(promises);

    const playerElos = users.reduce<Record<string, { rating: number; date: Date }>>((acc, user) => {
      return { ...acc, [user.username]: { rating: user.rating, date: new Date() } };
    }, {});
    console.log({ playerElos: [playerElos] });

    return playerElos;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
