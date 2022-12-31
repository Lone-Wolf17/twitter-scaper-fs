interface Tweet {
  createdAt: string;
  text: string;
  topicId: string;
  tweetId: string;
  updatedAt: string;
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

export type { GetTweetFilters, Tweet, TweetData };
