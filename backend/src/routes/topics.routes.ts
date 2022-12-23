import { Router } from "express";

import {
  createTopicSchema,
  searchTweetsSchema,
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
  validate(searchTweetsSchema),
  TopicsController.fetchTweets
);

export default router;
