require("dotenv").config();
import express from "express";
import cron from "node-cron";
import topicsRouter from "./controllers/topics";
import scrape_tweets from "./workers/scrape_tweets";

//cron.schedule("0/15 * * * * *", scrape_tweets);

(async () => {
  try {
    const app = express();
    app.use(express.json());
    app.use("/topics", topicsRouter);
    app.listen(process.env.PORT, () => {
      console.log(`Listening on PORT=${process.env.PORT}`);
    });
  } catch (error) {}
})();
