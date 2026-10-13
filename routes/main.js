import { Router } from 'express';
import * as mainController from '../controllers/mainControllers.js';
import { asyncHandler } from '../asyncHandler.js'

const router = Router();

router.get('/', asyncHandler(mainController.main));
router.get('/members', asyncHandler(mainController.members));
router.get('/users', asyncHandler(mainController.user));
router.post('/users/:id', asyncHandler(mainController.create));
router.put('/users/:id', asyncHandler(mainController.update));
router.delete('/users/:id', asyncHandler(mainController.destroy));

export default router;
