import {
  CreateTopicsBody,
  GetByTopicIDParams,
  ListTopicParams,
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

const fetchTweets = async (input: GetByTopicIDParams) => {
  return prismaClient.$transaction([
    prismaClient.tweet.findMany({
      where: {
        topicId: input.topicID! as string,
        createdAt: {
          lte: input.endTime ? new Date(input.endTime as string) : undefined,
          gte: input.startTime
            ? new Date(input.startTime as string)
            : undefined,
        },
        text: {
          search: input.query
            ? `${(input.query as string).split(" ").join(" & ")}`
            : undefined,
        },
      },
      orderBy: { createdAt: input.orderBy as Prisma.SortOrder },
    }),
    prismaClient.tweet.count({
      where: {
        topicId: input.topicID! as string,
        createdAt: {
          lte: input.endTime ? new Date(input.endTime as string) : undefined,
          gte: input.startTime
            ? new Date(input.startTime as string)
            : undefined,
        },
        text: {
          search: input.query
            ? `${(input.query as string).split(" ").join(" & ")}`
            : undefined,
        },
      },
    }),
  ]);
};

export default {
  createTopic,
  fetchAll,
  fetchTweets,
};
