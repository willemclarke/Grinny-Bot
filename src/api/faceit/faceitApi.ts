import axios from 'axios';
import { Player } from './faceitService';

export interface FaceitBasicResponse {
  player_id: string;
  nickname: string;
  avatar: string;
  games: {
    csgo: {
      skill_level: number;
      faceit_elo: number;
    };
  };
  faceit_url: string;
  errors?: [
    {
      message: string;
      http_status: number | string;
    }
  ];
}

export interface FaceitIndividualResponse {
  lifetime: {
    Matches: string;
    'Win Rate %': string;
    'Longest Win Streak': string;
    'Average K/D Ratio': string;
    'Average Headshots %': string;
  };
}

export class FaceitAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  // general API functions
  async getGeneralPlayerStats(game: string, username: string): Promise<FaceitBasicResponse> {
    const response = await axios.get(
      `https://open.faceit.com/data/v4/players?nickname=${username}&game=${game}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data;
  }

  async getNarrowPlayerStats(playerId: string, game: string): Promise<FaceitIndividualResponse> {
    const response = await axios.get(
      `https://open.faceit.com/data/v4/players/${playerId}/stats/${game}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data;
  }

  async getPlayerById(
    playerId: string
  ): Promise<Pick<FaceitBasicResponse, 'nickname' | 'games' | 'player_id'>> {
    const response = await axios.get(`https://open.faceit.com/data/v4/players/${playerId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return response.data;
  }

  // specific functions that use FaceitAPI functions
  async getFaceitPlayer(
    playerId: string
  ): Promise<{ id: string; username: string; rating: number; date: Date }> {
    const data = await this.getPlayerById(playerId);

    return {
      id: data.player_id,
      username: data.nickname,
      rating: data.games.csgo.faceit_elo,
      date: new Date(),
    };
  }

  async faceitPlayerElo(): Promise<Player[]> {
    const promises = [
      this.getFaceitPlayer('1b6a7877-766e-4dd6-9ef4-68c1b8e9d9ce'), // willem
      this.getFaceitPlayer('f613a6d8-9ddb-419d-9f22-66ad38c43f3c'), // bass
      this.getFaceitPlayer('f341d26d-9f2d-4e5d-a013-22d461572208'), // richie
      this.getFaceitPlayer('802f15e7-da6c-4ce9-82ab-e9e7e877bd76'), // dbou
    ];

    try {
      const playerElos = await Promise.all(promises);

      return playerElos;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // function to retrieve a user's ID
  async getFaceitUsersId(
    game: string,
    username: string
  ): Promise<{ username: string; rating: number; playerId: string }> {
    const userId = await this.getGeneralPlayerStats(game, username);

    return {
      username: userId.nickname,
      rating: userId.games.csgo.faceit_elo,
      playerId: userId.player_id,
    };
  }
}
