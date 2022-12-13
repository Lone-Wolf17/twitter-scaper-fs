import express, { Request, Response } from "express";
import slugify from "slugify";
import { createPaginator } from "prisma-pagination";

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
  "/:topicID",
  async (request: Request<GetByTopicIDParams>, response: Response) => {
    try {
      let [result, count] = await prismaClient.$transaction([
        prismaClient.tweet.findMany({
          where: { topicId: request.params.topicID },
        }),
        prismaClient.tweet.count({
          where: { topicId: request.params.topicID },
        }),
      ]);
      response.status(200).json({
        success: true,
        tweets: result,
        count: count,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "Something went wrong",
        code: "TOPIC_RETRIEVAL_FAILURE",
      });
    }
  }
);
export default router;
