import { FetchTopicsInput, FetchTweetsInput } from "../schemas/topics.schema";
import { paginateResult } from "../utils";
import { Request, Response } from "express";
import TopicsService from "../services/topics.service";

import {
  CreateTopicsBody,
  GetByTopicIDParams,
  ListTopicParams,
  UpdateTopicBody,
} from "./topics.dto";

export const createTopic = async (
  request: Request<any, any, CreateTopicsBody>,
  response: Response
) => {
  try {
    await TopicsService.createTopic(request.body);
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
  request: Request<any, any, any, FetchTopicsInput>,
  response: Response
) => {
  try {
    const [topics, count] = await TopicsService.fetchAllTopics(request.query);

    response.status(200).json({
      success: true,
      ...paginateResult({
        current_page: request.query.page,
        limit: request.query.limit,
        item_count: count,
      }),
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
  request: Request<any, any, any, FetchTweetsInput>,
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

    let [result, count] = await TopicsService.fetchTweets(request.query);

    response.status(200).json({
      success: true,
      ...paginateResult({
        current_page: request.query.page,
        limit: request.query.limit,
        item_count: count,
      }),
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

export const updateTopic = async (
  request: Request<{ id: string }, any, UpdateTopicBody>,
  response: Response
) => {
  try {
    await TopicsService.updateTopic(request.params.id, request.body);
    response.status(200).json({
      success: true,
      message: "Topic updated successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Something went wrong",
      code: "TOPIC_UPDATE_FAILURE",
    });
  }
};

export const deleteTopic = async (
  request: Request<{ id: string }>,
  response: Response
) => {
  try {
    await TopicsService.removeTopic(request.params.id);
    response.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Something went wrong",
      code: "TOPIC_DELETION_FAILURE",
    });
  }
};
