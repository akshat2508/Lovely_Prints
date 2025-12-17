import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  createColorMode,
  getColorModesByShop
} from '../controllers/colorMode.controller.js';

const router = express.Router();

router.post(
  '/:shopId/color-modes',
  authMiddleware,
  requireRole('shop_owner'),
  createColorMode
);

router.get(
  '/:shopId/color-modes',
  getColorModesByShop
);

export default router;
