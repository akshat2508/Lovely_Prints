// routes/auth.routes.js
import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  getOrganisations,
  refreshToken
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
router.post("/forgot-password", forgotPassword);
router.get("/organisations", getOrganisations);
router.post("/refresh", refreshToken);

export default router;
