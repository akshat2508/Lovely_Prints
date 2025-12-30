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
export const attachDocumentToOrder = async (orderId, payload) => {
  const res = await api.post(
    `/students/orders/${orderId}/documents`,
    payload
  )
  return res.data
}

/* ================= FILE UPLOAD ================= */

/**
 * POST /files/upload
 */
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })

  return res.data
}

/* ================= SHOPS ================= */

export const getAllShops = async () => {
  const res = await api.get("/shops")
  return res.data
}

export const getShopPrintOptions = async (shopId) => {
  const res = await api.get(`/shops/${shopId}/options`)
  return res.data
}

/* ================= PAYMENTS ================= */

/**
 * POST /payments/create-order
 */
export const createPaymentOrder = async (orderId) => {
  const res = await api.post("/payments/create-order", { orderId })
  return res.data
}

/**
 * POST /payments/verify
 */
export const verifyPayment = async (payload) => {
  const res = await api.post("/payments/verify", payload)
  return res.data
}
