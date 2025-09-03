import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getLatestChats, getReview } from "../controllers/aiController.js";

const router = express.Router();

router.post("/get-review", userAuth, getReview);
router.get("/latest", userAuth, getLatestChats);

export default router;


