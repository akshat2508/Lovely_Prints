import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { downloadDocument } from '../controllers/document.controller.js';

const router = express.Router();

router.get(
  '/:documentId/download',
  authMiddleware,
  downloadDocument
);

export default router;
