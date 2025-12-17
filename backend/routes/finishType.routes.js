import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  createFinishType,
  getFinishTypesByShop
} from '../controllers/finishType.controller.js';

const router = express.Router();

router.post(
  '/:shopId/finish-types',
  authMiddleware,
  requireRole('shop_owner'),
  createFinishType
);

router.get(
  '/:shopId/finish-types',
  getFinishTypesByShop
);

export default router;
