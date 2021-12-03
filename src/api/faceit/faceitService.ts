import { createPool, DatabasePoolType, QueryResultType, sql } from 'slonik';
import { dateTimeAsTimestamp } from './utils';

interface DbElo {
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

  async insertElo(elo: DbElo): Promise<QueryResultType<DbElo>> {
    const { username, rating, date } = elo;

    return await this.pool.connect(async (connection) => {
      return await connection.query<DbElo>(
        sql`INSERT INTO faceit_elos (username, elo, date) VALUES (${username}, ${rating}, ${dateTimeAsTimestamp(
          date
        )})`
      );
    });
  }

  async getElosForPlayer(username: string): Promise<readonly DbElo[]> {
    return this.pool.connect(async (connection) => {
      const userElos = await connection.query<DbElo>(
        sql`SELECT * from faceit_elos WHERE username IN (${username})`
      );
      console.log(userElos.rows);
      return userElos.rows;
    });
  }

  // getElosForPlayer(userId: string): Promise<DbElo[]>
  // syncElos
}
