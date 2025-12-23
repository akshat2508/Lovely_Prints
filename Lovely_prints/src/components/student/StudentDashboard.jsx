import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { getStudentOrders } from "../../services/studentService"
import "./dashboard.css"

/* Backend order flow */
const STATUS_FLOW = [
  "pending",
  "confirmed",
  "printing",
  "ready",
  "completed"
]

/* Backend → UI labels */
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
  cancelled: "Cancelled"
}

const StudentDashboard = () => {
  const navigate = useNavigate()

  /* UI State */
  const [showMenu, setShowMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [filter, setFilter] = useState("All")

  /* Data State */
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  /* Logout */
  const handleLogout = () => {
    navigate("/login")
  }

  /* Normalize backend status → filter label */
  const normalizeStatus = (status) => {
    if (status === "completed") return "Delivered"
    return "In Progress"
  }

  /* Fetch orders */
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      const res = await getStudentOrders()

      if (res?.success) {
        setOrders(res.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch orders", err)
    } finally {
      setLoadingOrders(false)
    }
  }

  /* Initial fetch */
  useEffect(() => {
    fetchOrders()
  }, [])

  /* Poll every 20s */
  useEffect(() => {
    const interval = setInterval(fetchOrders, 20000)
    return () => clearInterval(interval)
  }, [])

  /* Filter logic */
  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true
    return normalizeStatus(order.status) === filter
  })

  /* Timeline helper */
  const getTimelineState = (step, currentStatus) => {
    const stepIndex = STATUS_FLOW.indexOf(step)
    const currentIndex = STATUS_FLOW.indexOf(currentStatus)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "active"
    return ""
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header1">
        <div className="dashboard-left1">
          <img src={logo} alt="Lovely Prints" className="dashboard-logo" />
          <span className="dashboard-title">Lovely Prints</span>
        </div>

        <div className="profile-wrapper">
          <div
            className="profile-circle1"
            onClick={() => setShowMenu(!showMenu)}
          >
            S
          </div>

          {showMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="dashboard-content1">

        {/* TOP ACTIONS */}
        <div className="top-actions">
          <button
            className="new-order-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Print Order
          </button>

          <div className="filters">
            {["All", "In Progress", "Completed"].map(item => (
              <button
                key={item}
                className={`filter-btn ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS */}
        <h2 className="section-heading">Recent Orders</h2>

        {loadingOrders && (
          <p style={{ color: "#777" }}>Loading orders...</p>
        )}

        {!loadingOrders && filteredOrders.length === 0 && (
          <p style={{ color: "#777" }}>No orders found.</p>
        )}

        {filteredOrders.map(order => (
          <div className="order-card1" key={order.id}>
            <div>
              <strong>Order #{order.order_no}</strong>
              <p
                className={
                  order.status === "completed"
                    ? "status-complete"
                    : "status-progress"
                }
              >
                {STATUS_LABELS[order.status]}
              </p>
            </div>

            <div className="order-actions">
              <span className="order-price">
                ₹{order.total_price}
              </span>

              {order.status !== "completed" && (
                <button
                  className="track-btn"
                  onClick={() => {
                    setSelectedOrder(order)
                    setShowTrackModal(true)
                  }}
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        ))}

      </main>

      {/* CREATE ORDER MODAL (UI ONLY) */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Create Print Order</h2>

            <select className="modal-input">
              <option>Select Shop Location</option>
              <option>Block 27</option>
              <option>Block 38</option>
              <option>UniMall</option>
            </select>

            <select className="modal-input">
              <option>Paper Type</option>
              <option>A4</option>
              <option>Bond Paper</option>
              <option>Passport Size</option>
            </select>

            <input
              type="number"
              className="modal-input"
              placeholder="Number of Copies"
            />

            <select className="modal-input">
              <option>Orientation</option>
              <option>Portrait</option>
              <option>Landscape</option>
            </select>

            <select className="modal-input">
              <option>Urgency</option>
              <option>Normal</option>
              <option>High (+₹10)</option>
            </select>

            <label className="upload-box">
              📄 Upload Document
              <input type="file" hidden />
            </label>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="submit-btn">
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL (REAL STATUS) */}
      {showTrackModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">
              Track Order #{selectedOrder.order_no}
            </h2>

            <div className="timeline">
              {STATUS_FLOW.map(step => (
                <div
                  key={step}
                  className={`timeline-item ${getTimelineState(step, selectedOrder.status)}`}
                >
                  <span className="timeline-dot"></span>
                  <span className="timeline-text">
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowTrackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default StudentDashboard
