import request from "request";

export interface FaceitBasicResponse {
  player_id: string;
  nickname: string;
  games: {
    csgo: {
      skill_level_label: string;
      skill_level: number;
      faceit_elo: number;
    };
  };
  faceit_url: string;
  errors: [
    {
      message: string;
      http_status: number | string;
    }
  ];
}

export interface FaceitIndividualResponse {
  lifetime: {
    Matches: string;
    "Win Rate %": string;
    "Longest Win Streak": string;
    "Average K/D Ratio": string;
    "Average Headshots %": string;
  };
}

export class Faceit {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getGeneralStats(game: string, username: string): Promise<FaceitBasicResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: "https://open.faceit.com/data/v4/players",
        qs: { nickname: username, game: game },
        headers: { Authorization: `Bearer ${this.token}` }
      };

      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body));
      });
    });
  }

  getPlayerStats(playerId: string, game: string): Promise<FaceitIndividualResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://open.faceit.com/data/v4/players/${playerId}/stats/${game}`,
        headers: { Authorization: `Bearer ${this.token}` }
      };

      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body));
      });
    });
  }
}
