import { Prisma } from "@prisma/client";
import express, { Request, Response } from "express";
import slugify from "slugify";

import prismaClient from "../services/database";
import {
  CreateTopicsBody,
  GetByTopicIDParams,
  ListTopicParams,
} from "./topics.dto";

const router = express.Router();

router.post(
  "/create",
  async (request: Request<{ body: CreateTopicsBody }>, response: Response) => {
    try {
      const topic = await prismaClient.topic.create({
        data: {
          name: request.body.name,
          description: request.body.description,
          slug: slugify(request.body.name, { replacement: "_" }),
        },
      });
      response.status(200).json({
        success: true,
        message: "Topics created successfully",
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "Something went wrong",
        code: "TOPIC_CREATION_FAILURE",
      });
    }
  }
);

router.get(
  "/all",
  async (request: Request<ListTopicParams>, response: Response) => {
    try {
      const topics = await prismaClient.topic.findMany({
        take: request.params.take ?? 100,
        skip: request.params.skip ?? 0,
      });
      response.status(200).json({
        success: true,
        topics: topics,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "Something went wrong",
        code: "TOPIC_LISTING_FAILURE",
      });
    }
  }
);

router.get(
  "/tweets",
  async (
    request: Request<GetByTopicIDParams, GetByTopicIDParams>,
    response: Response
  ) => {
    try {
      let [result, count] = await prismaClient.$transaction([
        prismaClient.tweet.findMany({
          where: {
            topicId: request.query.topicID! as string,
            createdAt: {
              lte: request.query.endTime
                ? new Date(request.query.endTime as string)
                : undefined,
              gte: request.query.startTime
                ? new Date(request.query.startTime as string)
                : undefined,
            },
            text: {
              search: request.query.query
                ? `${(request.query.query as string).split(" ").join(" & ")}`
                : undefined,
            },
          },
          orderBy: { createdAt: request.query.orderBy as Prisma.SortOrder },
        }),
        prismaClient.tweet.count({
          where: {
            topicId: request.query.topicID! as string,
            createdAt: {
              lte: request.query.endTime
                ? new Date(request.query.endTime as string)
                : undefined,
              gte: request.query.startTime
                ? new Date(request.query.startTime as string)
                : undefined,
            },
            text: {
              search: request.query.query
                ? `${(request.query.query as string).split(" ").join(" & ")}`
                : undefined,
            },
          },
        }),
      ]);

      response.status(200).json({
        success: true,
        tweets: result,
        count: count,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        success: false,
        message: "Something went wrong",
        code: "TOPIC_RETRIEVAL_FAILURE",
      });
    }
  }
);
export default router;
