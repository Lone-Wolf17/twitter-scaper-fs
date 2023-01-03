import { TweetData } from "../types/tweet.dto";

const topicsMockedData = {
  meta: {
    current_page: 1,

    last_page: 1,

    limit: "50",

    next_page: null,

    prev_page: null,
  },

  topics: [
    {
      id: "1",

      name: "Davido",

      description: "OBO",

      slug: "Davido",

      createdAt: "2022-12-31T11:51:28.103Z",

      updatedAt: "2022-12-31T11:51:28.103Z",
    },

    {
      id: "2",

      name: "Wizkid",

      description: "Starboy",

      slug: "Wizkid",

      createdAt: "2022-12-30T11:51:28.103Z",

      updatedAt: "2022-12-30T11:51:28.103Z",
    },
  ],
};

const tweetsMockedData: TweetData = {
  success: true,

  meta: {
    current_page: "1",

    limit: "20",

    last_page: 502,

    prev_page: 0,

    next_page: 2,
  },

  tweets: [
    {
      tweetId: "1",

      text: "@Chiefpriiest @davido 001",

      topicId: "1a",

      tweeterId: "1b",

      createdAt: "2022-12-31T11:50:12.000Z",

      updatedAt: "2022-12-31T19:14:30.790Z",

      bookmarked: true,

      tweeter: {
        id: "1b",

        name: "Mickey Richie",

        username: "Mickey Richie",
      },

      topic: {
        id: "1a",

        name: "Davido",

        description: "Omo baba olowo",

        slug: "Davido",

        createdAt: "2022-12-31T11:51:28.103Z",

        updatedAt: "2023-01-02T12:46:13.835Z",
      },
    },

    {
      tweetId: "2",

      text: "RT @damotozey: Only few naija artists strive to continuously improve their sound from previous album or tracks- to mention a few: Rema, Bur…",

      topicId: "2a",

      tweeterId: "2b",

      createdAt: "2022-12-31T11:50:33.000Z",

      updatedAt: "2022-12-31T19:14:16.830Z",

      bookmarked: false,

      tweeter: {
        id: "2b",

        name: "Omobee",

        username: "Omobee",
      },

      topic: {
        id: "2a",

        name: "Davido",

        description: "Omo baba olowo",

        slug: "Davido",

        createdAt: "2022-12-31T11:51:28.103Z",

        updatedAt: "2023-01-02T12:46:13.835Z",
      },
    },
  ],

  count: 10030,
};

const unbookmarkedTweetMockedData = {
  success: true,
  tweet: {
    tweetId: "1",
    text: "@Chiefpriiest @davido 001",
    topicId: "1a",
    tweeterId: "1b",
    createdAt: "2022-12-31T11:50:12.000Z",
    updatedAt: "2022-12-31T19:14:30.790Z",
    bookmarked: false,
    tweeter: {
      id: "1b",
      name: "Mickey Richie",
      username: "Mickey Richie",
    },
    topic: {
      id: "1a",
      name: "Davido",
      description: "Omo baba olowo",
      slug: "Davido",
      createdAt: "2022-12-31T11:51:28.103Z",
      updatedAt: "2023-01-02T12:46:13.835Z",
    },
  },
};

const bookmarkedTweetMockedData = {
  success: true,
  tweet: {
    tweetId: "2",
    text: "RT @damotozey: Only few naija artists strive to continuously improve their sound from previous album or tracks- to mention a few: Rema, Bur…",
    topicId: "2a",
    tweeterId: "2b",
    createdAt: "2022-12-31T11:50:33.000Z",
    updatedAt: "2022-12-31T19:14:16.830Z",
    bookmarked: true,
    tweeter: {
      id: "2b",
      name: "Omobee",
      username: "Omobee",
    },
    topic: {
      id: "2a",
      name: "Davido",
      description: "Omo baba olowo",
      slug: "Davido",
      createdAt: "2022-12-31T11:51:28.103Z",
      updatedAt: "2023-01-02T12:46:13.835Z",
    },
  },
};

export {
  topicsMockedData,
  tweetsMockedData,
  bookmarkedTweetMockedData,
  unbookmarkedTweetMockedData,
};
