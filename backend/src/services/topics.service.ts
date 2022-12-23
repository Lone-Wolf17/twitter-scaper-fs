import {
  CreateTopicsBody,
  GetByTopicIDParams,
  ListTopicParams,
  UpdateTopicBody,
} from "../controllers/topics.dto";
import { Prisma } from "@prisma/client";
import prismaClient from "./database";
import slugify from "slugify";

const createTopic = async (input: CreateTopicsBody) => {
  return await prismaClient.topic.create({
    data: {
      name: input.name,
      description: input.description,
      slug: slugify(input.name, { replacement: "_" }),
    },
  });
};

const fetchAll = async (input: ListTopicParams) => {
  return prismaClient.topic.findMany({
    take: input.take ?? 100,
    skip: input.skip ?? 0,
  });
};

const fetchTweets = async ({
  topicID,
  startTime,
  endTime,
  query,
  orderBy,
}: GetByTopicIDParams) => {
  let finalEndTime: Date;
  if (endTime) {
    finalEndTime = new Date(endTime);
    // we do this ensure that the endTime actually returns tweets from today.
    // when given a date string, JS create a string with the time set to 00:00:00
    // this eliminates tweets from the current date.
    finalEndTime.setHours(23, 59, 59);
  }

  const whereQuery = {
    topicId: topicID! as string,
    createdAt: {
      lte: endTime ? finalEndTime! : undefined,
      gte: startTime ? new Date(startTime) : undefined,
    },
    text: {
      search: query
        ? `${(query as string).split(" ").join(" & ")}`
        : undefined,
    },
  };

  return prismaClient.$transaction([
    prismaClient.tweet.findMany({
      where: whereQuery,
      orderBy: { createdAt: orderBy as Prisma.SortOrder },
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
  return await prismaClient.topic.update({
    where: { id },
    data: {
      name,
      description,
      slug: slugify(name, { replacement: "_" }),
    },
  });
};

const removeTopic = async (id: string) => {
  return await prismaClient.topic.delete({
    where: { id },
  });
};

export default {
  createTopic,
  fetchAll,
  fetchTweets,
  updateTopic,
  removeTopic,
};
