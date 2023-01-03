import {
  FetchBookmarkedTweetsInput,
  FetchTopicsInput,
  FetchTweetsInput,
  SetBookmarkTweetInput,
} from "../schemas/topics.schema";
import { paginateResult } from "../utils";
import { Request, Response } from "express";
import TopicsService from "../services/topics.service";
import { PrismaErrorCodes } from "../constants/prisma-error-codes";

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
    const topic = await TopicsService.createTopic(request.body);
    response.status(200).json({
      success: true,
      topic,
      message: "Topic created successfully",
    });
  } catch (error: any) {
    let message = "Something went wrong";
    if (error.code && error.code === PrismaErrorCodes.RecordNotFound) {
      message = "Invalid ID. Topic not found";
    }
    response.status(500).json({
      success: false,
      message,
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

export const updateTopic = async (
  request: Request<{ id: string }, any, UpdateTopicBody>,
  response: Response
) => {
  try {
    const topic = await TopicsService.updateTopic(
      request.params.id,
      request.body
    );
    response.status(200).json({
      success: true,
      topic,
      message: "Topic updated successfully",
    });
  } catch (error) {
    console.log(error);
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
  } catch (error: any) {
    let message = "Something went wrong";
    if (error.code && error.code === PrismaErrorCodes.RecordNotFound) {
      message = "Invalid ID. Topic not found";
    }
    response.status(500).json({
      success: false,
      message,
      code: "TOPIC_DELETION_FAILURE",
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
      code: "TWEETS_RETRIEVAL_FAILURE",
    });
  }
};

export const setTweetBookmarkStatus = async (
  request: Request<any, any, SetBookmarkTweetInput>,
  response: Response
) => {
  try {
    let tweet = await TopicsService.setTweetBookmarkStatus(request.body);

    response.status(200).json({
      success: true,
      tweet,
    });
  } catch (error: any) {
    let message = "Something went wrong";
    if (error.code && error.code === PrismaErrorCodes.RecordNotFound) {
      message = "Invalid ID. Tweet not found";
    }
    response.status(500).json({
      success: false,
      message,
      code: "SET_TWEET_BOOKMARK_STATUS_FAILURE",
    });
  }
};

export const fetchBookmarkedTweets = async (
  request: Request<any, any, any, FetchBookmarkedTweetsInput>,
  response: Response
) => {
  try {
    let [result, count] = await TopicsService.fetchBookmarkedTweets(
      request.query
    );

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
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Something went wrong",
      code: "BOOKMARKED_TWEETS_RETRIEVAL_FAILURE",
    });
  }
};
