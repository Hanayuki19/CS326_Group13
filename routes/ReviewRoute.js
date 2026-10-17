import { Router } from "express";
import * as reviewController from "../controllers/ReviewController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();
router.get("/", asyncHandler(reviewController.list));
router.post("/", asyncHandler(reviewController.create));
export default router;