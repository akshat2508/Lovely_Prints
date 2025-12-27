import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import {
  getStudentOrders,
  getAllShops,
  getShopPrintOptions,
  createStudentOrder,
  uploadOrderDocument
} from "../../services/studentService"
import api from "../../services/api"
import "./dashboard.css"

const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"]

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
  cancelled: "Cancelled"
}

export default function StudentDashboard() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const [showStep1, setShowStep1] = useState(false)
  const [showStep2, setShowStep2] = useState(false)

  // Step 1 state
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState("")
  const [shopOptions, setShopOptions] = useState(null)
  const [description, setDescription] = useState("")

  const [paperType, setPaperType] = useState("")
  const [colorMode, setColorMode] = useState("")
  const [finishType, setFinishType] = useState("")
  const [copies, setCopies] = useState(1)
  const [pages, setPages] = useState(1)

  // Step 2 state
  const [orderId, setOrderId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  /* ================= Fetch Orders ================= */
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      const res = await getStudentOrders()
      if (res?.success) setOrders(res.data)
    } catch (err) {
      console.log("error fetching orders", err)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  /* =================== Step 1: Fetch Shops =================== */
  useEffect(() => {
    if (!showStep1) return
    const fetchShops = async () => {
      const res = await getAllShops()
      if (res?.success) setShops(res.data)
    }
    fetchShops()
  }, [showStep1])

  /* =================== Step 1: Fetch Print Options =================== */
  useEffect(() => {
    if (!selectedShop) return

    const fetchOptions = async () => {
      const res = await getShopPrintOptions(selectedShop)
      if (res?.success) setShopOptions(res.data)
    }

    fetchOptions()
  }, [selectedShop])

  /* =======================================================
     Step 1 → Create Order & Store print settings
  ======================================================== */
  const saveOrderDetails = async () => {
    if (!selectedShop || !paperType || !colorMode || !finishType) return

    try {
      const payload = {
        shop_id: selectedShop,
        description: description || ""
      }

      const res = await createStudentOrder(payload)

      if (res?.success) {
        setOrderId(res.data.id) // store order ID for step 2
        setShowStep1(false)
        setShowStep2(true)
      }
    } catch (err) {
      console.log("order create error", err)
      alert("Order creation failed")
    }
  }

  /* =======================================================
     Step 2 → Upload file & Attach document to order
  ======================================================== */
  const handleUploadDocument = async (e) => {
    const file = e.target.files[0]
    if (!file || !orderId) return

    try {
      setUploading(true)

      // 1️⃣ Upload file
      const fd = new FormData()
      fd.append("file", file)

      const uploadRes = await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (!uploadRes.data.success) {
        alert("Failed uploading file")
        setUploading(false)
        return
      }

      const fileKey = uploadRes.data.data.fileKey

      // 2️⃣ Attach to order using Step-1 choices
      const attachPayload = {
        fileKey,
        fileName: file.name,
        page_count: pages,
        copies,
        paper_type_id: paperType,
        color_mode_id: colorMode,
        finish_type_id: finishType
      }

      const attachRes = await uploadOrderDocument(orderId, attachPayload)

      if (attachRes?.success) {
        alert("Document added successfully!")
        setShowStep2(false)
        fetchOrders()
      }

    } catch (err) {
      console.log("upload doc error", err)
      alert("Failed attaching document")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header1">
        <div className="logo-wrap">
          <img src={logo} className="dashboard-logo" />
          <span className="dashboard-title">Lovely Prints</span>
        </div>
        <button className="profile-circle1" onClick={handleLogout}>S</button>
      </header>

      {/* CREATE BUTTON */}
      <button
        className="new-order-btn"
        onClick={() => setShowStep1(true)}
      >
        + Create New Print Order
      </button>

      {/* ORDERS LIST */}
      <h2 className="section-heading">Recent Orders</h2>

      {loadingOrders && <p className="muted-text">Loading…</p>}

      {orders.map(order => {
        const doc = order.documents?.[0]
        return (
          <div className="order-card1" key={order.id}>
            <div className="order-left">
              <strong className="order-title">Order #{order.order_no}</strong>
              <p className={`order-status ${order.status}`}>
                {STATUS_LABELS[order.status]}
              </p>

              <p>{order.shops?.shop_name} ({order.shops?.block})</p>

              {doc && (
                <>
                  <p>{doc.file_name} — {doc.page_count} pages</p>
                  <p className="muted">
                    {doc.paper_types?.name} • {doc.finish_types?.name} • {doc.color_modes?.name}
                  </p>
                </>
              )}

              <p className={order.is_paid ? "paid" : "unpaid"}>
                {order.is_paid ? "✔ Paid" : "✖ Not Paid"}
              </p>
            </div>

            <div className="order-right">
              <strong>₹{order.total_price}</strong>
            </div>
          </div>
        )
      })}

      {/* ================= STEP 1 MODAL ================= */}
      {/* ================= STEP 1 MODAL ================= */}
{showStep1 && (
  <div className="modal-overlay">
    <div className="modal-card">

      <h2 className="modal-title">Step 1 — Order Details</h2>

      {/* SHOP */}
      <label className="modal-label">Select Shop</label>
      <select
        className="modal-input"
        value={selectedShop}
        onChange={(e) => setSelectedShop(e.target.value)}
      >
        <option value="">Choose shop</option>
        {shops.map(s => (
          <option key={s.id} value={s.id}>{s.shop_name} ({s.block})</option>
        ))}
      </select>

      {/* PRINT OPTIONS */}
      {shopOptions && (
        <>
          <label className="modal-label">Paper Type</label>
          <select
            className="modal-input"
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
          >
            <option value="">Select Paper Type</option>
            {shopOptions.paper_types.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label className="modal-label">Color Mode</label>
          <select
            className="modal-input"
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
          >
            <option value="">Select Color Mode</option>
            {shopOptions.color_modes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label className="modal-label">Finish Type</label>
          <select
            className="modal-input"
            value={finishType}
            onChange={(e) => setFinishType(e.target.value)}
          >
            <option value="">Select Finish Type</option>
            {shopOptions.finish_types.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </>
      )}

      {/* COPIES & PAGES */}
      <div className="modal-row">
        <div className="modal-col">
          <label className="modal-label">Copies</label>
          <input
            type="number"
            min="1"
            className="modal-input"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
          />
        </div>

        <div className="modal-col">
          <label className="modal-label">Pages</label>
          <input
            type="number"
            min="1"
            className="modal-input"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <label className="modal-label">Description (optional)</label>
      <textarea
        className="modal-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Eg: Print my resume"
      />

      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setShowStep1(false)}>
          Cancel
        </button>
        <button
          className="submit-btn"
          onClick={saveOrderDetails}
          disabled={!selectedShop || !paperType || !colorMode || !finishType}
        >
          Save & Continue →
        </button>
      </div>

    </div>
  </div>
)}

      {/* ================= STEP 2 MODAL ================= */}
      {showStep2 && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Step 2 — Upload Document</h3>

            <input type="file" onChange={handleUploadDocument} />
            {uploading && <p>Uploading...</p>}

            <button onClick={() => setShowStep2(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
