const express = require("express");
const cors = require("cors");
const path = require("path");
const Unblocker = require("unblocker");
const ytdl = require("ytdl-core");

class App {
  #port;

  constructor(port) {
    this.#port = port;

    this.init();
  }

  init() {
    this.app = express();

    // create server
    this.unblocker = new Unblocker({
      prefix: "/proxy/",
    });
    this.app.use(this.unblocker);
    this.app.use(cors());

    // serve js files and index.html to the server
    this.app.use(express.static(path.join(__dirname, "../client")));

    this.app.get("/videos", async (req, res) => {
      const videoInfo = await ytdl.getInfo(req.query.videoId);
      videoInfo.formats = ytdl.filterFormats(
        videoInfo.formats,
        "videoandaudio"
      );

      res.json(videoInfo);
    });

    // show server
    this.app.listen(this.#port, () => {
      console.log(`Server listening on port ${this.#port}. \n`);
    });
  }
}

const app = new App(2000);
