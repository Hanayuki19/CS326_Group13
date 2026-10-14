import { Router } from "express";
import * as studentController from "../controllers/StudentControllers.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(studentController.students));
router.post("/:id", asyncHandler(studentController.create));
router.put("/:id", asyncHandler(studentController.update));
router.delete("/:id", asyncHandler(studentController.deleteStudent));

export default router;
