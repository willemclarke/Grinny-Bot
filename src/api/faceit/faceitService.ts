import { createPool, sql } from 'slonik';

interface DbElo {
  username: string;
  rating: number;
  date: Date;
}

export class FaceitService {
  token: string;

  constructor(token: string) {
    this.token = token;

    const pool = createPool(this.token, { ssl: { rejectUnauthorized: false } });

    pool.connect(async (connection) => {
      const test = await connection.query(sql`SELECT * FROM faceit_elos`);
      console.log(JSON.stringify(test.rows, null, 2));
    });
  }

  // insertElo(elo: DbElo): Promise<DbElo>
  // getElosForPlayer(userId: string): Promise<DbElo[]>
  // syncElos
}
