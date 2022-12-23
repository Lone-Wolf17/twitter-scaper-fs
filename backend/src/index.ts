require("dotenv").config();
import express from "express";
import cors from "cors";

import { Worker } from "worker_threads";
import topicsRouter from "./controllers/topics";

const worker = new Worker("./src/workers/scrape_tweets.ts");
worker.on("online", () => {
  console.log("Successfully started worker for tweet scraper every 15 seconds");
});
worker.on("error", (e) => {
  console.log(e);
});
worker.on("exit", () => {
  console.log("Successfully ended worker for tweet scraper every 15 seconds");
});

(async () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(
      cors({
        origin: ["http://localhost:3000"],
        credentials: true,
      })
    );
    app.use("/topics", topicsRouter);
    app.listen(process.env.BACKEND_PORT, () => {
      console.log(`Listening on PORT=${process.env.BACKEND_PORT}`);
    });
  } catch (error) {}
})();
