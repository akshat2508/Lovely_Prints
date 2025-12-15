// routes/file.routes.js
import express from 'express';
import { uploadFile, getFileUrl } from '../controllers/file.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/:fileKey(*)', getFileUrl);

export default router;