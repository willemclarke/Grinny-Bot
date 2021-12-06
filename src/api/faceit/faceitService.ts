import { createPool, DatabaseConnectionType, DatabasePoolType, QueryResultType, sql } from 'slonik';
import { FaceitAPI } from './faceitApi';
import { dateTimeAsTimestamp } from './utils';
import { schedule } from 'node-cron';

export interface Player {
  username: string;
  rating: number;
  date: Date;
  id: string;
}

// TODO: hve this class take in a database connection
// -- createPool in index.ts and pass into this class. that way we only have 1 pool for whole app.

export class FaceitService {
  token: string;
  faceitApi: FaceitAPI;
  pool: DatabasePoolType;

  constructor(token: string, faceitApi: FaceitAPI, pool: DatabasePoolType) {
    this.token = token;
    this.faceitApi = faceitApi;
    this.pool = pool;
  }

  async insertElo(player: Player): Promise<QueryResultType<Player>> {
    const { username, rating, date, id } = player;

    return await this.pool.connect(async (connection) => {
      return await connection.query<Player>(
        sql`INSERT INTO faceit_elos (username, elo, date, id) VALUES (${username}, ${rating}, ${dateTimeAsTimestamp(
          date
        )}, ${id})`
      );
    });
  }

  async getElosForPlayer(username: string): Promise<readonly Player[]> {
    return this.pool.connect(async (connection) => {
      const { rows } = await connection.query<Player>(
        sql`SELECT * from faceit_elos WHERE username IN (${username})`
      );
      return rows;
    });
  }

  // every x seconds ==== */x * * * * *
  // every x hours === 0 0 */x * * *
  async pollFaceitElos() {
    schedule('0 0 */8 * * *', async () => {
      const playerElos = await this.faceitApi.faceitPlayerElo();
      const insertPlayers = playerElos.map((player) => this.insertElo(player));
      console.log(`Writing ${JSON.stringify(playerElos, null, 2)} to database`);

      return insertPlayers;
    });
  }
}
