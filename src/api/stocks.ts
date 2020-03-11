import request from "request";

export interface StocksResponse {
  symbols_requested: number;
  symbols_returned: number;
  data: [
    {
      symbol: string;
      name: string;
      price: string;
      currency: string;
      price_open: string;
      day_high: string;
      day_low: string;
      "52_week_high": string;
      "52_week_low": string;
      day_change: string;
      change_pct: string;
      close_yesterday: string;
      market_cap: string;
      volume: string;
      volume_avg: string;
      shares: string;
      stock_exchange_long: string;
      stock_exchange_short: string;
      timezone: string;
      timezone_name: string;
      gmt_offset: string;
      last_trade_time: string;
      pe: string;
      eps: string;
    }
  ];
  Message: string;
}

export class StocksAPI {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getStockData(symbol: string): Promise<StocksResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://api.worldtradingdata.com/api/v1/stock?symbol=${symbol}&api_token=${this.token}`
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
