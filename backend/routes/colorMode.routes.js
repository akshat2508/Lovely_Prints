import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  createColorMode,
  getColorModesByShop,
  updateColorMode
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

router.patch(
  '/color-modes/:id',
  authMiddleware,
  requireRole('shop_owner'),
  updateColorMode
);

export default router;
