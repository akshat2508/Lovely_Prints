import { useEffect, useState } from "react"
import { getStudentOrders } from "../../../services/studentService"
import TrackOrderModal from "../modals/TrackOrderModal"
import OrderCard from "../components/OrderCard"
import "../dashboard.css"

const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"]

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
  cancelled: "Cancelled",
}

const StudentOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await getStudentOrders()
      if (res?.success) setOrders(res.data || [])
    } catch (err) {
      console.error("Failed to fetch orders", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="dashboard">
      <h1 style={{ padding: "16px" }}>My Orders</h1>

      {loading && <p style={{ padding: 16 }}>Loading orders...</p>}

      <main className="dashboard-content1">
        {orders.map(order => (
  <OrderCard key={order.id} order={order} />
))}
      </main>

      {selectedOrder && (
        <TrackOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default StudentOrders
