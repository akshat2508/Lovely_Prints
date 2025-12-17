import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  createPaperType,
  getPaperTypesByShop
} from '../controllers/paperType.controller.js';

const router = express.Router();

// shop owner creates paper type
router.post(
  '/:shopId/paper-types',
  authMiddleware,
  requireRole('shop_owner'),
  createPaperType
);

// anyone can view paper types
router.get(
  '/:shopId/paper-types',
  getPaperTypesByShop
);

export default router;
