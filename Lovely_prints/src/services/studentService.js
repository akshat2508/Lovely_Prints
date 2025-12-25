import api from "./api"

/* ================= ORDERS ================= */

/**
 * GET /students/orders
 */
export const getStudentOrders = async () => {
  const res = await api.get("/students/orders")
  return res.data
}

/**
 * POST /students/orders
 */
export const createStudentOrder = async (payload) => {
  const res = await api.post("/students/orders", payload)
  return res.data
}

/**
 * POST /students/orders/:orderId/documents
 */
export const uploadOrderDocument = async (orderId, formData) => {
  const res = await api.post(
    `/students/orders/${orderId}/documents`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  )
  return res.data
}

/* ================= SHOPS ================= */

/**
 * GET /shops
 * Fetch all active shops
 */
export const getAllShops = async () => {
  const res = await api.get("/shops")
  return res.data
}

/**
 * GET /shops/:shopId
 */
export const getShopDetails = async (shopId) => {
  const res = await api.get(`/shops/${shopId}`)
  return res.data
}

/**
 * GET /shops/:shopId/options
 */
export const getShopPrintOptions = async (shopId) => {
  const res = await api.get(`/shops/${shopId}/options`)
  return res.data
}
