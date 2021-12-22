import plotly from 'plotly';
import fs from 'fs';

export interface PlotlyData {
  x: (number | string | Date)[];
  y: number[];
  type: string;
  name?: string;
}

interface PlotlyLayout {
  title: string;
  yaxis: {
    title: string;
  };
  font: {
    size: number;
  };
}

interface PlotlyImageOptions {
  format: string;
  height: number;
}

export class Plotly {
  username: string;
  host: string;
  apiKey: string;
  plotly: any;

  constructor(username: string, apiKey: string, host: string) {
    this.username = username;
    this.apiKey = apiKey;
    this.host = host;
    this.plotly = plotly({ username: username, apiKey: apiKey, host: host });
  }

  createGraph(
    data: PlotlyData[],
    layout: PlotlyLayout,
    imgOpts: PlotlyImageOptions,
    fileName: string
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const figure = { data, layout };

        this.plotly.getImage(figure, imgOpts, (error: any, imageStream: fs.ReadStream) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          const writeStream = fs.createWriteStream(fileName);
          imageStream.pipe(writeStream).on('finish', resolve);
        });
      } catch (err) {
        console.log(err);
        return err;
      }
    });
  }

  deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      });
    });
  }
}
