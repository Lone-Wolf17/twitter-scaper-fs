import { Router } from "express";
import * as TopicsController from "../controllers/topics.controller";

const router = Router();

router.post("/create", TopicsController.createPost);

router.get("/all", TopicsController.fetchAllPosts);

router.get("/tweets", TopicsController.fetchTweets);

export default router;
