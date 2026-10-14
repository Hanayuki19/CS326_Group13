import { Router } from "express";
import * as mainController from "../controllers/MainControllers.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(mainController.main));
router.get("/members", asyncHandler(mainController.members));

export default router;
