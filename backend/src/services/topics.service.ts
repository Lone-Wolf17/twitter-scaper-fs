import {
  CreateTopicsBody,
  ListTopicParams,
  UpdateTopicBody,
} from "../controllers/topics.dto";
import { Prisma } from "@prisma/client";
import prismaClient from "./database";
import {
  FetchTweetsInput,
  SetBookmarkTweetInput,
  FetchBookmarkedTweetsInput,
} from "../schemas/topics.schema";
import { slugifyTopic } from "../utils";

const createTopic = async (input: CreateTopicsBody) => {
  return await prismaClient.topic.create({
    data: {
      name: input.name,
      description: input.description,
      slug: slugifyTopic(input.name),
    },
  });
};

const fetchAllTopics = async (input: ListTopicParams) => {
  const result_per_page = input.limit ? Number(input.limit) : 100;
  const current_page = input.page ? Number(input.page) : 1;

  return prismaClient.$transaction([
    prismaClient.topic.findMany({
      take: result_per_page,
      skip: (current_page - 1) * result_per_page,
    }),
    prismaClient.topic.count({}),
  ]);
};

const fetchTweets = async ({
  topicID,
  startTime,
  endTime,
  query,
  orderBy,
  limit,
  page,
  bookmarked,
}: FetchTweetsInput) => {
  let finalEndTime: Date;
  if (endTime) {
    finalEndTime = new Date(endTime);
    // we do this ensure that the endTime actually returns tweets from today.
    // when given a date string, JS create a string with the time set to 00:00:00
    // this eliminates tweets from the current date.
    finalEndTime.setHours(23, 59, 59);
  }

  const whereQuery: Prisma.TweetWhereInput = {
    topicId: topicID! as string,
    createdAt: {
      lte: endTime ? finalEndTime! : undefined,
      gte: startTime ? new Date(startTime) : undefined,
    },
    text: {
      contains: query ? `${(query as string).split(" ").join("&")}` : undefined,
      mode: "insensitive",
    },
    bookmarked: bookmarked ? Boolean(bookmarked) : undefined,
  };

  const result_per_page = limit ? Number(limit) : 50;
  const current_page = page ? Number(page) : 1;

  return prismaClient.$transaction([
    prismaClient.tweet.findMany({
      where: whereQuery,
      include: {
        tweeter: true,
        topic: true,
      },
      orderBy: { createdAt: orderBy as Prisma.SortOrder },
      take: result_per_page,
      skip: (current_page - 1) * result_per_page,
    }),
    prismaClient.tweet.count({
      where: whereQuery,
    }),
  ]);
};

const updateTopic = async (
  id: string,
  { name, description }: UpdateTopicBody
) => {
  const topic = await prismaClient.topic.findUniqueOrThrow({
    where: { id },
  });

  // if slug is diff, its the same as creating a new topic.
  //  so delete tweets that have been scapped for topic
  // this ensures that tweets are not linked to the wrong topic
  if (topic.slug != slugifyTopic(name)) {
    await prismaClient.tweet.deleteMany({
      where: {
        topicId: topic.id,
      },
    });
  }
  return await prismaClient.topic.update({
    where: { id },
    data: {
      name,
      description,
      slug: slugifyTopic(name),
    },
  });
};

const removeTopic = async (id: string) => {
  return await prismaClient.topic.delete({
    where: { id },
  });
};

const setTweetBookmarkStatus = async ({
  tweetId,
  bookmarked,
}: SetBookmarkTweetInput) => {
  return await prismaClient.tweet.update({
    where: { tweetId },
    data: {
      bookmarked,
    },
    include: {
      topic: true,
      tweeter: true,
    },
  });
};

const fetchBookmarkedTweets = async ({
  limit,
  page,
}: FetchBookmarkedTweetsInput) => {
  const result_per_page = limit ? Number(limit) : 50;
  const current_page = page ? Number(page) : 1;

  const whereQuery = {
    bookmarked: true,
  };

  return prismaClient.$transaction([
    prismaClient.tweet.findMany({
      where: whereQuery,
      include: {
        topic: true,
        tweeter: true,
      },
      take: result_per_page,
      skip: (current_page - 1) * result_per_page,
    }),
    prismaClient.tweet.count({
      where: whereQuery,
    }),
  ]);
};

export default {
  createTopic,
  fetchAllTopics,
  fetchTweets,
  updateTopic,
  removeTopic,
  setTweetBookmarkStatus,
  fetchBookmarkedTweets,
};
