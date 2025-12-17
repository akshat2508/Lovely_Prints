import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import {
  getPrintOptionsByShop,
  createPrintOption
} from '../controllers/printOptions.controller.js';

const router = express.Router();

// Shop owner creates print options
router.post(
  '/',
  authMiddleware,
  roleMiddleware('shop_owner'),
  createPrintOption
);

// Student / public: get print options for a shop
router.get('/:shopId', getPrintOptionsByShop);

export default router;
