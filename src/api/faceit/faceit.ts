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
}