import { createPool, DatabasePoolType, QueryResultType, sql } from 'slonik';
import { dateTimeAsTimestamp } from './utils';

interface Player {
  username: string;
  rating: number;
  date: Date;
}

export class FaceitService {
  token: string;
  pool: DatabasePoolType;

  constructor(token: string) {
    this.token = token;
    this.pool = createPool(this.token, { ssl: { rejectUnauthorized: false } });
  }

  async insertElo(player: Player): Promise<QueryResultType<Player>> {
    const { username, rating, date } = player;
    console.log('Date pre parse: ', date);

    return await this.pool.connect(async (connection) => {
      return await connection.query<Player>(
        sql`INSERT INTO faceit_elos (username, elo, date) VALUES (${username}, ${rating}, ${dateTimeAsTimestamp(
          date
        )})`
      );
    });
  }

  async getElosForPlayer(username: string): Promise<readonly Player[]> {
    return this.pool.connect(async (connection) => {
      const { rows } = await connection.query<Player>(
        sql`SELECT * from faceit_elos WHERE username IN (${username})`
      );
      console.log(rows);
      return rows;
    });
  }

  // TODO: syncElos
}
