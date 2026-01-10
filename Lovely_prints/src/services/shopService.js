import api from "./api";

/**
 * Adapt backend order → UI order
 */
const adaptOrder = (order) => {
  const doc = order.documents?.[0] || {};

  return {
    // order
    id: order.id,
    orderNo: order.order_no,
    status: order.status,
    createdAt: order.created_at,
    orientation: order.orientation,
    isUrgent: order.is_urgent,
    urgencyFee: order.urgency_fee,
    isPaid: order.is_paid ?? false,

    // student
    studentName: order.student?.name || "Unknown",
    studentId: order.student_id || "-",

    // document
    documentId: doc.id,
    documentName: doc.file_name || "Document",

    // print details
    paperType: doc.paper_types?.name || "-",
    colorMode: doc.color_modes?.name || "-",
    finishType: doc.finish_types?.name || "-",
    copies: doc.copies || 1,

    // placeholders
    eta: "—",
  };
};


/**
 * GET orders for logged-in shop owner
 */
export const getShopOrders = async () => {
  const res = await api.get("/shops/me/orders");

  return {
    success: true,
    data: res.data.data.map(adaptOrder),
  };
};

/**
 * PATCH update order status
 */
export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data;
};

/**
 * GET secure document download URL
 */
export const getDocumentDownloadUrl = async (documentId) => {
  const res = await api.get(`/documents/${documentId}/download`);
  return res.data.data.url;
};



/* ================= PRINT CONFIG ================= */

export const getPaperTypes = async (shopId) => {
  const res = await api.get(`/shops/${shopId}/paper-types`);
  return res.data;
};

export const getColorModes = async (shopId) => {
  const res = await api.get(`/shops/${shopId}/color-modes`);
  return res.data;
};

export const getFinishTypes = async (shopId) => {
  const res = await api.get(`/shops/${shopId}/finish-types`);
  return res.data;
};


/* ================= CREATE OPTIONS ================= */

export const createPaperType = async (shopId, payload) => {
  const res = await api.post(`/shops/${shopId}/paper-types`, payload);
  return res.data;
};

export const createColorMode = async (shopId, payload) => {
  const res = await api.post(`/shops/${shopId}/color-modes`, payload);
  return res.data;
};

export const createFinishType = async (shopId, payload) => {
  const res = await api.post(`/shops/${shopId}/finish-types`, payload);
  return res.data;
};