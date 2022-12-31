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
      const tweets = (
        await twitterClient.v2.search(topic.slug, {
          "tweet.fields": "created_at",
          "user.fields": "username",
          expansions: "author_id",
        })
      ).data;

      tweetCount = tweets.data.length;
      
      /// We updat the tweeter table, so we can safely reference it in the tweet tabel
      await prismaClient.$transaction(
        tweets.includes.users.map((user) =>
          prismaClient.tweeter.upsert({
            where: {
              id: user.id,
            },
            create: {
              id: user.id,
              name: user.name,
              username: user.name,
            },
            update: {
              name: user.name,
              username: user.username,
            },
          })
        )
      );

      await prismaClient.tweet.createMany({
        data: tweets.data.map((v) => {
          return {
            tweetId: v.id,
            text: v.text,
            topicId: topic.id,
            createdAt: new Date(v.created_at),
            tweeterId: v.author_id,
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
