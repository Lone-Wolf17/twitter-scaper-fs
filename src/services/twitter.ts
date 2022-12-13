import { TwitterApi } from "twitter-api-v2";

let twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_API_TOKEN!,
  accessSecret: process.env.TWITTER_API_TOKEN_SECRET!,
});

export { twitterClient };
