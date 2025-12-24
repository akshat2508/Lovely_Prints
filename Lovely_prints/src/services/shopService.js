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

    // placeholders (future)
    eta: "—",
    isExpress: false,
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
