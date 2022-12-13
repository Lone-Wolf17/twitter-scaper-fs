import prismaClient from "../services/database";
import { twitterClient } from "../services/twitter";

const scrape_tweets = async () => {
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
          return { tweetId: v.id, text: v.text, topicId: topic.id };
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
};

export default scrape_tweets;
