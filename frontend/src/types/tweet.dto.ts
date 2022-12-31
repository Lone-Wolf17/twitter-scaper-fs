import { Topics } from "./topic.dto";

interface Tweet {
  createdAt: string;
  text: string;
  topicId: string;
  tweetId: string;
  topic: Topics;
  updatedAt: string;
  bookmarked: boolean;
  tweeterId: string;
  tweeter: {
    id: string;
    name: string;
    username: string;
  };
}

interface TweetData {
  count: number;
  meta: any;
  success: boolean;
  tweets: Tweet[];
}

type GetTweetFilters = {
  topicID?: string;
  startTime?: string;
  endTime?: string;
  orderBy?: string;
  query?: string;
  limit: string;
  page: string;
  bookmarked?: string;
};

type routeType = "Get-All" | "Get-Bookmarked" | "Set-Bookmark";

export type { GetTweetFilters, Tweet, TweetData, routeType };
