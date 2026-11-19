import { Router } from "express";
import * as reviewController from "../controllers/ReviewController.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();
router.get("/", asyncHandler(reviewController.list));
router.post("/", requireLogin, asyncHandler(reviewController.create));
export default router;
