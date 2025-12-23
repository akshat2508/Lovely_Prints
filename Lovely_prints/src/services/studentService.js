import api from "./api"

/**
 * Fetch all orders for logged-in student
 * GET /students/orders
 */
export const getStudentOrders = async () => {
  const res = await api.get("/students/orders")
  return res.data
}

/**
 * Create new order
 * POST /students/orders
 */
export const createStudentOrder = async (payload) => {
  const res = await api.post("/students/orders", payload)
  return res.data
}

/**
 * Upload document to order
 * POST /students/orders/:orderId/documents
 */
export const uploadOrderDocument = async (orderId, formData) => {
  const res = await api.post(
    `/students/orders/${orderId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )
  return res.data
}
