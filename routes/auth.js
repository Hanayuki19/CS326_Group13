import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import * as authController from "../controllers/authController.js";

const router = Router();

router.get("/login", authController.getLogin);
router.post("/login", asyncHandler(authController.login));
router.get("/register", authController.getRegister);
router.post("/register", asyncHandler(authController.register));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", asyncHandler(authController.me));

export default router;
