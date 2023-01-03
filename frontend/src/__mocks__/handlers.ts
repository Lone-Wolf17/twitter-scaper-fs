import { rest } from "msw";
import { BackendEndpoints } from "../constants/BackendEndpoints";
import {
  topicsMockedData,
  tweetsMockedData,
  bookmarkedTweetMockedData,
  unbookmarkedTweetMockedData,
} from "./mockerValues";

export const handlers = [
  // Topics Handlers
  rest.get(BackendEndpoints.baseUrl + "/topics/all", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(topicsMockedData));
  }),
  rest.post(BackendEndpoints.baseUrl + "/topics/create", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(topicsMockedData));
  }),
  rest.put(BackendEndpoints.baseUrl + "/topics/1", async (req, res, ctx) => {
    console.log("Handler called");
    const body = (await req.json()) as object
    return res(ctx.status(200), ctx.json({
        topic: {
            id: 1,
            ...body
        }
    }));
  }),
  rest.delete(BackendEndpoints.baseUrl + "/topics/1", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(topicsMockedData));
  }),

  /// Tweets Handlers
  rest.get(BackendEndpoints.baseUrl + "/topics/tweets", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(tweetsMockedData));
  }),
  rest.put(
    BackendEndpoints.baseUrl + "/topics/tweets/setBookmarkStatus",
    async (req, res, ctx) => {
      const body = await req.json();
      if (body.bookmarked) {
        return res(ctx.status(200), ctx.json(bookmarkedTweetMockedData));
      } else {
        return res(ctx.status(200), ctx.json(unbookmarkedTweetMockedData));
      }
    }
  ),
  rest.get(
    BackendEndpoints.baseUrl + "/topics/tweets/bookmarked",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(tweetsMockedData));
    }
  ),
];
