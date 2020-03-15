import plotly from "plotly";
import fs from "fs";

interface PlotlyData {
  x: number[];
  y: number[];
  type: string;
}

interface PlotlyLayout {
  title: string;
  yaxis: {
    title: string;
  };
}

interface PlotlyImageOptions {
  format: string;
  height: number;
}

export class Plotly {
  username: string;
  token: string;
  plotly: any;

  constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.plotly = plotly(username, token);
  }

  createGraph(data: PlotlyData, layout: PlotlyLayout, imgOpts: PlotlyImageOptions, fileName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const figure = { data: [data], layout };

        this.plotly.getImage(figure, imgOpts, (error: any, imageStream: fs.ReadStream) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          const writeStream = fs.createWriteStream(fileName);
          imageStream.pipe(writeStream).on("finish", () => {
            resolve();
          });
        });
      } catch (err) {
        console.log(err);
        return err;
      }
    });
  }

  deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      });
    });
  }
}
