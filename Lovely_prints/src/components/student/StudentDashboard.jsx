import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  getStudentOrders,
  createStudentOrder,
  getAllShops,
  getShopPrintOptions,
  uploadFile,
  attachDocumentToOrder,
} from "../../services/studentService";
import "./dashboard.css";
import Payments from "./Payments"
import { logoutUser } from "../../services/authService";


const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"];

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  /* Orders */
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* Modal */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  /* Shop & options */
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [shopOptions, setShopOptions] = useState(null);

  /* Print config */
  const [paperType, setPaperType] = useState("");
  const [colorMode, setColorMode] = useState("");
  const [finishType, setFinishType] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [copies, setCopies] = useState(1);

  /* File */
  const [selectedFile, setSelectedFile] = useState(null);

  /* Submit */
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
  try {
    await logoutUser();
    navigate("/login"); // redirect after logout
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await getStudentOrders();
      if (res?.success) setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!showCreateModal) return;

    const fetchShops = async () => {
      const res = await getAllShops();
      if (res?.success) setShops(res.data);
    };

    fetchShops();
  }, [showCreateModal]);

  useEffect(() => {
    if (!selectedShop) return;

    const fetchOptions = async () => {
      const res = await getShopPrintOptions(selectedShop);
      if (res?.success) setShopOptions(res.data);
    };

    fetchOptions();
  }, [selectedShop]);

  /* 🔥 CORE LOGIC */
  const handleSubmitOrder = async () => {
    if (!selectedFile) return;

    try {
      setSubmitting(true);

      // 1️⃣ Create order
      const orderRes = await createStudentOrder({
        shop_id: selectedShop,
        description: "Print order",
      });

      const orderId = orderRes.data.id;

      // 2️⃣ Upload file
      const uploadRes = await uploadFile(selectedFile);
      const fileKey = uploadRes.data.fileKey;

      // 3️⃣ Attach document
      await attachDocumentToOrder(orderId, {
        fileKey,
        fileName: selectedFile.name,
        page_count: pageCount,
        copies,
        paper_type_id: paperType,
        color_mode_id: colorMode,
        finish_type_id: finishType,
      });

      // 4️⃣ Reset UI
      setShowCreateModal(false);
      setSelectedShop("");
      setShopOptions(null);
      setSelectedFile(null);
      setPaperType("");
      setColorMode("");
      setFinishType("");
      setPageCount(1);
      setCopies(1);

      fetchOrders();
    } catch (err) {
      console.error("Order creation failed", err);
      alert("Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header1">
  <img src={logo} alt="Lovely Prints" className="dashboard-logo" />

  <div className="header-actions">
    <button onClick={() => setShowCreateModal(true)}>
      + Create New Print Order
    </button>

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</header>


      <main className="dashboard-content1">
        {loadingOrders && <p>Loading orders...</p>}

        {orders.map((order) => {
          const doc = order.documents?.[0];

          return (
            <div className="order-card1" key={order.id}>
              <div className="order-left">
                {/* Order Number */}
                <strong className="order-title">Order #{order.order_no}</strong>

                {/* Shop info */}
                <p className="order-shop">
                  {order.shops?.shop_name}
                  <span className="order-block"> ({order.shops?.block})</span>
                </p>

                {/* Notes */}
                {order.notes && <p className="order-notes">{order.notes}</p>}

                {/* Document info */}
                {doc && (
                  <>
                    <p className="order-doc">
                      {doc.file_name}
                      <span className="muted">
                        {" "}
                        — {doc.page_count} page(s) × {doc.copies}
                      </span>
                    </p>

                    <p className="order-printinfo">
                      {doc.paper_types?.name} • {doc.color_modes?.name} •{" "}
                      {doc.finish_types?.name}
                    </p>
                  </>
                )}

                {/* Status */}
                <p className={`order-status ${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </p>

                {/* Payment */}
                <p
                  className={`order-paid ${order.is_paid ? "paid" : "unpaid"}`}
                >
                  {order.is_paid ? "✔ Paid" : "✖ Not Paid"}
                </p>

                {/* Mobile price */}
                <p className="order-price-mobile">₹{order.total_price}</p>
              </div>

              {/* Right side */}
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
                {!order.is_paid && (
  <Payments
    order={order}
    onSuccess={() => fetchOrders()}
  />
)}

              </div>
            </div>
          );
        })}
      </main>

      {showCreateModal && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2 className="modal-title">Create Print Order</h2>

      {/* Shop */}
      <select
        className="modal-input1"
        value={selectedShop}
        onChange={(e) => setSelectedShop(e.target.value)}
      >
        <option value="">Select Shop</option>
        {shops.map((s) => (
          <option key={s.id} value={s.id}>
            {s.shop_name}
          </option>
        ))}
      </select>

      {/* Paper Type */}
      <select
        className="modal-input1"
        value={paperType}
        onChange={(e) => setPaperType(e.target.value)}
      >
        <option value="">Paper Type</option>
        {shopOptions?.paper_types.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Color Mode */}
      <select
        className="modal-input1"
        value={colorMode}
        onChange={(e) => setColorMode(e.target.value)}
      >
        <option value="">Color Mode</option>
        {shopOptions?.color_modes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Finish Type */}
      <select
        className="modal-input1"
        value={finishType}
        onChange={(e) => setFinishType(e.target.value)}
      >
        <option value="">Finish Type</option>
        {shopOptions?.finish_types.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      {/* Page Count */}
      <label>Page Count
      <input
        type="number"
        className="modal-input1"
        placeholder="Page Count"
        min={1}
        value={pageCount}
        onChange={(e) => setPageCount(Number(e.target.value))}
      />
      </label>

      {/* Copies */}
        <label>No. of copies
      <input
        type="number"
        className="modal-input1"
        placeholder="Copies"
        min={1}
        value={copies}
        onChange={(e) => setCopies(Number(e.target.value))}
      />
      </label>

      {/* File Upload */}
      <label className="upload-box1">
        Upload Document (PDF / DOC)
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </label>

      {selectedFile && (
        <div className="upload-filename1">
          {selectedFile.name}
        </div>
      )}

      {/* Actions */}
      <div className="modal-actions">
        <button
          className="submit-btn1"
          disabled={submitting}
          onClick={handleSubmitOrder}
        >
          {submitting ? "Submitting..." : "Submit Order"}
        </button>

        <button
          className="cancel-btn1"
          onClick={() => setShowCreateModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {showTrackModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">
              Track Order #{selectedOrder.order_no}
            </h2>

            <div className="timeline">
              {STATUS_FLOW.map((step) => (
                <div
                  key={step}
                  className={`timeline-item ${
                    STATUS_FLOW.indexOf(step) <
                    STATUS_FLOW.indexOf(selectedOrder.status)
                      ? "completed"
                      : STATUS_FLOW.indexOf(step) ===
                        STATUS_FLOW.indexOf(selectedOrder.status)
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="timeline-dot"></span>
                  <span className="timeline-text">{STATUS_LABELS[step]}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn1"
                onClick={() => setShowTrackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;