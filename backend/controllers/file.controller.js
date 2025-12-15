// controllers/file.controller.js
import storageService from '../services/storage.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const fileKey = await storageService.uploadFile(req.file);

    return successResponse(res, { fileKey }, 'File uploaded successfully');
  } catch (error) {
    next(error);
  }
};

export const getFileUrl = async (req, res, next) => {
  try {
    const fileKey = req.params.fileKey;

    if (!fileKey) {
      return errorResponse(res, 'File key is required', 400);
    }

    const url = await storageService.getSignedUrl(fileKey);

    return successResponse(res, { url }, 'Signed URL generated successfully');
  } catch (error) {
    next(error);
  }
};