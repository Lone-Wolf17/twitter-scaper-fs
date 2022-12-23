import { Request, Response } from "express";
import TopicService from "../services/topics.service";

import {
  CreateTopicsBody,
  GetByTopicIDParams,
  ListTopicParams,
} from "./topics.dto";

export const createTopic = async (
  request: Request<any, any, CreateTopicsBody>,
  response: Response
) => {
  try {
    await TopicService.createTopic(request.body);
    response.status(200).json({
      success: true,
      message: "Topic created successfully",
    });
  } catch (error) {
    // console.log(error);
    response.status(500).json({
      success: false,
      message: "Something went wrong",
      code: "TOPIC_CREATION_FAILURE",
    });
  }
};

export const fetchAllTopics = async (
  request: Request<ListTopicParams>,
  response: Response
) => {
  try {
    const topics = await TopicService.fetchAll(request.params);

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
};

export const fetchTweets = async (
  request: Request<any, any, any, any, GetByTopicIDParams>,
  response: Response
) => {
  try {
    if (!request.query.topicID) {
      return response.status(400).json({
        success: false,
        message: "topicID is required",
        code: "TOPIC_RETRIEVAL_FAILURE",
      });
    }

    let [result, count] = await TopicService.fetchTweets(request.query);

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
};
