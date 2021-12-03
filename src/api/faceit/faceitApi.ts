import axios from 'axios';

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

  // General API functions
  async getGeneralStats(game: string, username: string): Promise<FaceitBasicResponse> {
    const response = await axios.get(
      `https://open.faceit.com/data/v4/players?nickname=${username}&game=${game}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data;
  }

  async getPlayerStats(playerId: string, game: string): Promise<FaceitIndividualResponse> {
    const response = await axios.get(
      `https://open.faceit.com/data/v4/players/${playerId}/stats/${game}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data;
  }

  async getPlayerGraphStats(
    playerId: string
  ): Promise<Pick<FaceitBasicResponse, 'nickname' | 'games'>> {
    const response = await axios.get(`https://open.faceit.com/data/v4/players/${playerId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return response.data;
  }

  // Specific functions that use FaceitAPI functions

  async getFaceitUserElo(playerId: string): Promise<{ username: string; rating: number }> {
    const data = await this.getPlayerGraphStats(playerId);

    return {
      username: data.nickname,
      rating: data.games.csgo.faceit_elo,
    };
  }

  async getFaceitUserId(
    game: string,
    username: string
  ): Promise<{ username: string; rating: number; playerId: string }> {
    const userId = await this.getGeneralStats(game, username);

    return {
      username: userId.nickname,
      rating: userId.games.csgo.faceit_elo,
      playerId: userId.player_id,
    };
  }

  async faceitUserData() {
    const promises = [
      this.getFaceitUserElo('1b6a7877-766e-4dd6-9ef4-68c1b8e9d9ce'), // willem
      this.getFaceitUserElo('f613a6d8-9ddb-419d-9f22-66ad38c43f3c'), // bass
      this.getFaceitUserElo('f341d26d-9f2d-4e5d-a013-22d461572208'), // richie
      this.getFaceitUserElo('802f15e7-da6c-4ce9-82ab-e9e7e877bd76'), // dbou
    ];

    try {
      const users = await Promise.all(promises);

      const playerElos = users.reduce<Record<string, { rating: number; date: Date }>>(
        (acc, user) => {
          return { ...acc, [user.username]: { rating: user.rating, date: new Date() } };
        },
        {}
      );
      console.log({ playerElos });

      return playerElos;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
