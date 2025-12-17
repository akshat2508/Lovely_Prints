// routes/auth.routes.js
import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post(
  '/logout',
  authMiddleware,
  logout
);

router.get(
  '/me',
  authMiddleware,
  getCurrentUser
);

export default router;
