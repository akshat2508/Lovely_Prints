import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  getShopOrders,
  getShopPrintOptions,
  getMyShopOrders,
  getMyShop
} from '../controllers/shop.controller.js';
import { updateOrderStatus } from '../controllers/shop.controller.js';

const router = express.Router();

// --------------------
// Public routes
// --------------------
router.get('/', getAllShops);
router.get(
  '/me',
  authMiddleware,
  requireRole('shop_owner'),
  getMyShop
);

router.get('/:id', getShopById);

// Get print options (paper / color / finish) for a shop
router.get('/:shopId/options', getShopPrintOptions);

// --------------------
// Shop owner routes
// --------------------
router.post(
  '/',
  authMiddleware,
  requireRole('shop_owner'),
  createShop
);

router.put(
  '/:id',
  authMiddleware,
  requireRole('shop_owner'),
  updateShop
);


router.get(
  '/me/orders',
  authMiddleware,
  requireRole('shop_owner'),
  getMyShopOrders
);

router.get(
  '/:id/orders',
  authMiddleware,
  requireRole('shop_owner'),
  getShopOrders
);

// router.put(
//   '/orders/:orderId/status',
//   authMiddleware,
//   requireRole('shop_owner'),
//   updateOrderStatus
// );


export default router;
