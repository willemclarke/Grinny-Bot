import { config } from "dotenv";

config();

export interface Config {
  discordToken: string;
  faceitToken: string;
  weatherToken: string;
  stocksToken: string;
  nasaToken: string;
  imdbToken: string;
  urbanToken: string;
  plotlyToken: string;
  plotlyUsername: string;
}

export function getEnv(value: string) {
  const env = process.env[value];
  if (!env) {
    throw new Error(`Unable to get ${value} from environment variables`);
  } else {
    return env;
  }
}

export const fromEnv = (): Config => {
  return {
    discordToken: getEnv("DISCORD_TOKEN"),
    faceitToken: getEnv("FACEIT_TOKEN"),
    weatherToken: getEnv("WEATHER_TOKEN"),
    stocksToken: getEnv("STOCKS_TOKEN"),
    nasaToken: getEnv("NASA_TOKEN"),
    imdbToken: getEnv("IMDB_TOKEN"),
    urbanToken: getEnv("URBAN_TOKEN"),
    plotlyToken: getEnv("PLOTLY_TOKEN"),
    plotlyUsername: getEnv("PLOTLY_USERNAME")
  };
};
