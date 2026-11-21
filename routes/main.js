import { Router } from "express";
import * as mainController from "../controllers/mainControllers.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.get("/", asyncHandler(mainController.main));
router.get("/members", asyncHandler(mainController.members));
router.post("/members", requireLogin, asyncHandler(mainController.add_member));
router.delete(
  "/members/:name",
  requireLogin,
  asyncHandler(mainController.delete_member)
);

export default router;
