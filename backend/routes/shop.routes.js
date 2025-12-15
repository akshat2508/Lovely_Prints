// routes/shop.routes.js
import express from 'express';
import { getAllShops, getShopById, createShop, updateShop, getShopOrders } from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/', getAllShops);
router.get('/:id', getShopById);
router.post('/', createShop);
router.put('/:id', updateShop);
router.get('/:id/orders', getShopOrders);

export default router;