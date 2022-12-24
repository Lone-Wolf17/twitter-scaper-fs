import { Router } from "express";

import {
  createTopicSchema,
  fetchTweetsSchema,
  setBookmarkTweetSchema,
} from "../schemas/topics.schema";
import { validate } from "../middlewares/validate";
import * as TopicsController from "../controllers/topics.controller";

const router = Router();

router.post(
  "/create",
  validate(createTopicSchema),
  TopicsController.createTopic
);

router.get("/all", TopicsController.fetchAllTopics);

router.get(
  "/tweets",
  validate(fetchTweetsSchema),
  TopicsController.fetchTweets
);

router.put("/:id", validate(createTopicSchema), TopicsController.updateTopic);

router.delete("/:id", TopicsController.deleteTopic);

router.put(
  "/tweets/setBookmarkStatus",
  validate(setBookmarkTweetSchema),
  TopicsController.setTweetBookmarkStatus
);

export default router;
