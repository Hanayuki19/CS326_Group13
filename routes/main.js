import { Router } from "express";
import * as mainController from "../controllers/mainControllers.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(mainController.main));
router.get("/login", asyncHandler(mainController.get_login));
router.post("/login", asyncHandler(mainController.login));
router.get("/register", asyncHandler(mainController.get_register));
router.post("/register", asyncHandler(mainController.register));
router.get("/members", asyncHandler(mainController.members));
router.post("/members", asyncHandler(mainController.add_member));
router.delete("/members/:name", asyncHandler(mainController.delete_member));

export default router;
