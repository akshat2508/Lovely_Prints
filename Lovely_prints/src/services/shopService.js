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
    pickup_at: order.pickup_at,
    orientation: order.orientation,
    isHandled: order.is_handled,
    notes:order.notes,
    handlingFee: order.handling_fee,
    isPaid: order.is_paid ?? false,
    isExpired: order.is_expired ?? false,
    totalPrice : order.total_price,
    orderType: order.order_type,
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
    docPrice : doc.total_price,
    printSide : doc.print_side,

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

/**
 * VERIFY delivery OTP (final delivery step)
 */
export const verifyOrderOtp = async (orderId, otp) => {
  const res = await api.post(`/orders/${orderId}/verify-otp`, { otp });
  return res.data;
};

export const setShopActiveStatus = async (isActive) => {
  const res = await api.patch("/shops/me/status", {
    is_active: isActive,
  });
  return res.data;
};
// GET logged-in owner's shop
export const getMyShop = async () => {
  const res = await api.get("/shops/me");
  return {
    success: true,
    data: res.data.data, // { id, name, is_active }
  };
};


// MANUAL shop toggle (explicit)
export const setShopStatusManual = async (shopId, isActive) => {
  const res = await api.patch(`/shops/${shopId}/status`, {
    is_active: isActive,
  });
  return res.data;
};


// MANUAL accepting orders toggle
export const setShopAcceptingOrders = async (isAccepting) => {
  const res = await api.patch("/shops/me/accepting-orders", {
    is_accepting_orders: isAccepting,
  });
  return res.data;
};