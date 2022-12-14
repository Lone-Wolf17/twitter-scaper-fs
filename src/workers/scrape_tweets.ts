require("dotenv").config();
const { parentPort } = require("worker_threads");
const { PrismaClient } = require("@prisma/client");
const { TwitterApi } = require("twitter-api-v2");
const cron = require("node-cron");

const prismaClient = new PrismaClient();
let twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_API_TOKEN,
  accessSecret: process.env.TWITTER_API_TOKEN_SECRET,
});

cron.schedule("0/15 * * * * *", async () => {
  try {
    let tweetCount = 0;
    const topics = await prismaClient.topic.findMany({
      select: { name: true, slug: true, id: true },
    });

    for (let topic of topics) {
      const tweets = (await twitterClient.v2.search(topic.slug)).data;
      tweetCount = tweets.data.length;
      await prismaClient.tweet.createMany({
        data: tweets.data.map((v) => {
          return {
            tweetId: v.id,
            text: v.text,
            topicId: topic.id,
            createdAt: new Date(v.created_at),
          };
        }),
        skipDuplicates: true,
      });
    }

    console.log(
      `Successfully scraped tweets for ${topics.length} topics -> ${tweetCount} tweets`
    );
  } catch (error) {
    console.error(error);
  }
});
