import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import {
  getStudentOrders,
  getAllShops,
  getShopPrintOptions
} from "../../services/studentService"
import "./dashboard.css"

/* Backend order lifecycle */
const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"]

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

  /* UI state */
  const [showMenu, setShowMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [filter, setFilter] = useState("All")

  /* Orders */
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  /* Create order (API driven) */
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState("")
  const [shopOptions, setShopOptions] = useState(null)
  const [loadingOptions, setLoadingOptions] = useState(false)

  /* Controlled dropdowns */
  const [paperType, setPaperType] = useState("")
  const [colorMode, setColorMode] = useState("")
  const [finishType, setFinishType] = useState("")

  /* Logout */
  const handleLogout = () => navigate("/login")

  /* Normalize for filters */
  const normalizeStatus = (status) =>
    status === "completed" ? "Completed" : "In Progress"

  /* Fetch orders */
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      const res = await getStudentOrders()
      if (res?.success) setOrders(res.data || [])
    } catch (err) {
      console.error("Failed to fetch orders", err)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchOrders, 20000)
    return () => clearInterval(interval)
  }, [])

  /* Fetch shops when modal opens */
  useEffect(() => {
    if (!showCreateModal) return

    const fetchShops = async () => {
      try {
        const res = await getAllShops()
        if (res?.success) setShops(res.data)
      } catch (err) {
        console.error("Failed to fetch shops", err)
      }
    }

    fetchShops()
  }, [showCreateModal])

  /* 🔥 FIXED: Fetch print options (correct response mapping) */
  useEffect(() => {
    if (!selectedShop) return

    setPaperType("")
    setColorMode("")
    setFinishType("")
    setShopOptions(null)

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true)
        const res = await getShopPrintOptions(selectedShop)

        // ✅ IMPORTANT FIX: res.data is already the inner `data`
        if (res?.success) {
          setShopOptions(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch shop options", err)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [selectedShop])

  /* Filter orders */
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

        {/* ACTIONS */}
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

{loadingOrders && <p className="muted-text">Loading orders...</p>}
{!loadingOrders && filteredOrders.length === 0 && (
  <p className="muted-text">No orders found.</p>
)}

{filteredOrders.map(order => {
  const doc = order.documents?.[0];

  return (
    <div className="order-card1" key={order.id}>
      <div className="order-left">
        {/* Order Number */}
        <strong className="order-title">Order #{order.order_no}</strong>

        {/* Shop */}
        <p className="order-shop">
          <span className="icon"></span> {order.shops?.shop_name}
          <span className="order-block"> ({order.shops?.block})</span>
        </p>

        {/* Notes (only if exists) */}
        {order.notes && (
          <p className="order-notes">
            <span className="icon"></span> {order.notes}
          </p>
        )}

        {/* Document details */}
        {doc && (
          <>
            <p className="order-doc">
              <span className="icon"></span>
              {doc.file_name}
              <span className="muted"> — {doc.page_count} page(s)</span>
            </p>

            <p className="order-printinfo muted">
              {doc.paper_types?.name} • {doc.finish_types?.name} • {doc.color_modes?.name}
            </p>
          </>
        )}

        {/* Status */}
        <p className={`order-status ${order.status}`}>
          {STATUS_LABELS[order.status]}
        </p>

        {/* Payment */}
        <p className={`order-paid ${order.is_paid ? "paid" : "unpaid"}`}>
          {order.is_paid ? "✔ Paid" : "✖ Not Paid"}
        </p>

        {/* Price */}
        <p className="order-price-mobile">₹{order.total_price}</p>
      </div>

      {/* Right actions */}
      <div className="order-right">
        <span className="order-price">₹{order.total_price}</span>

        {order.status !== "completed" && (
          <button
            className="track-btn"
            onClick={() => {
              setSelectedOrder(order);
              setShowTrackModal(true);
            }}
          >
            Track Order
          </button>
        )}
      </div>
    </div>
  );
})}

</main>

      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Create Print Order</h2>

            {/* Shop */}
            <select
              className="modal-input"
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
            >
              <option value="">Select Shop</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>
                  {shop.shop_name} ({shop.block})
                </option>
              ))}
            </select>

            {/* Paper Type */}
            <select
              className="modal-input"
              value={paperType}
              onChange={(e) => setPaperType(e.target.value)}
              disabled={!shopOptions}
            >
              <option value="">Select Paper Type</option>
              {shopOptions?.paper_types.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Color Mode */}
            <select
              className="modal-input"
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value)}
              disabled={!shopOptions}
            >
              <option value="">Select Color Mode</option>
              {shopOptions?.color_modes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Finish Type */}
            <select
              className="modal-input"
              value={finishType}
              onChange={(e) => setFinishType(e.target.value)}
              disabled={!shopOptions}
            >
              <option value="">Select Finish Type</option>
              {shopOptions?.finish_types.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <label className="upload-box">
              📄 Upload Document
              <input type="file" hidden />
            </label>

            {loadingOptions && <p className="muted">Loading print options...</p>}

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedShop("")
                  setShopOptions(null)
                }}
              >
                Cancel
              </button>

              <button
                className="submit-btn"
                disabled={!paperType || !colorMode || !finishType}
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
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
