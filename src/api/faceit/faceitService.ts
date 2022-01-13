import { DatabasePoolType, QueryResultType, sql } from 'slonik';
import { FaceitAPI } from './faceitApi';
import { dateTimeAsTimestamp } from './utils';
import { schedule, ScheduledTask } from 'node-cron';
import _ from 'lodash';
import { PlotlyData } from '../plotly';

export interface Player {
  username: string;
  rating: number;
  date: Date;
  id: string;
}

interface RawGraphData {
  windowed_date: number;
  username: string;
  max: number;
}

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

    return this.pool.connect(async (connection) => {
      return connection.query<Player>(
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

  async getElosForGraph(): Promise<readonly RawGraphData[]> {
    return this.pool.connect(async (connection) => {
      const { rows } = await connection.query<RawGraphData>(sql`
      SELECT date_trunc('day', date::date) AS windowed_date, username, MAX(elo)
      FROM faceit_elos
      GROUP BY windowed_date, username
      ORDER BY windowed_date, username`);

      return rows;
    });
  }

  transFormGraphData(data: readonly RawGraphData[]): PlotlyData[] {
    const restPlotlyOptions: Partial<PlotlyData> = { type: 'scatter', mode: 'lines+markers' };
    const transformedData = _.chain(data)
      .groupBy('username')
      .mapValues((item) => {
        return item.reduce<PlotlyData>(
          (acc, item) => {
            return {
              ...acc,
              x: [...acc.x, new Date(item.windowed_date).toISOString()],
              y: [...acc.y, item.max],
              name: item.username,
            };
          },
          { x: [], y: [], ...restPlotlyOptions }
        );
      })
      .values()
      .value();
    return transformedData;
  }

  // every x seconds ==== */x * * * * *
  // every x hours === 0 0 */x * * *
  async pollFaceitElos(): Promise<ScheduledTask> {
    return schedule('0 0 */8 * * *', async () => {
      await this.writePlayerElos();
    });
  }

  async writePlayerElos() {
    const playerElos = await this.faceitApi.faceitPlayerElo();
    console.log(`Writing ${JSON.stringify(playerElos, null, 2)} to database`);
    return Promise.all(playerElos.map((player) => this.insertElo(player)));
  }
}
