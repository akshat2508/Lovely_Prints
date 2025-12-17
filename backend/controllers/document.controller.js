import supabaseService from '../services/supabase.service.js';
import storageService from '../services/storage.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const downloadDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;
const role = req.user.user_metadata?.role;

    const token = req.headers.authorization.split(' ')[1];

    // 1️⃣ Fetch document with order + shop context
    const { data: document, error } =
      await supabaseService.getDocumentForDownload(documentId, token);

    if (error || !document) {
      return errorResponse(res, 'Document not found', 404);
    }

    const order = document.orders;

    // 2️⃣ Ownership checks
    const isStudent =
      role === 'student' && order.student_id === userId;

    const isShopOwner =
      role === 'shop_owner' &&
      order.shops?.owner_id === userId;

    const isAdmin = role === 'admin';

    if (!isStudent && !isShopOwner && !isAdmin) {
      return errorResponse(res, 'Access denied', 403);
    }

    // 3️⃣ Generate signed URL
    const signedUrl =
      await storageService.getSignedUrl(document.file_url);

    return successResponse(res, { url: signedUrl });
  } catch (error) {
    next(error);
  }
};
