import { Router } from "express";
import * as studentController from "../controllers/StudentControllers.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.get("/", requireLogin, asyncHandler(studentController.students));
router.get(
  "/student/:id",
  requireLogin,
  asyncHandler(studentController.student)
);
router.post("/:id", requireLogin, asyncHandler(studentController.create));
router.put("/:id", requireLogin, asyncHandler(studentController.update));
router.delete(
  "/:id",
  requireLogin,
  asyncHandler(studentController.deleteStudent)
);

export default router;
