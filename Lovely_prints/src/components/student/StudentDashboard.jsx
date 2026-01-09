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
import { startPayment } from "./Payments";
import { PDFDocument } from "pdf-lib";

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
  /* Order-level config */
  const [orientation, setOrientation] = useState("portrait");
  const [isUrgent, setIsUrgent] = useState(false);

  const URGENCY_FEE = 10; // UI display only (DB is source of truth)

  /* New state to hold the freshly created order for payment */
  const [orderReadyForPayment, setOrderReadyForPayment] = useState(null);

  /* File */
  const [selectedFile, setSelectedFile] = useState(null);

  /* Submit */
  const [submitting, setSubmitting] = useState(false);

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
      console.table(res.data);
    };

    fetchOptions();
  }, [selectedShop]);

  /* 🔥 CORE LOGIC */
  const handleSubmitOrderAndPreparePayment = async () => {
    if (!selectedFile) return;

    try {
      setSubmitting(true);

      // 1️⃣ Create order
      const orderRes = await createStudentOrder({
        shop_id: selectedShop,
        description: "Print order",

        orientation, // 👈 NEW
        is_urgent: isUrgent, // 👈 NEW (urgency_fee handled by DB trigger)
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

      // 4️⃣ Set this order to be ready for payment
      const preparedOrder = {
        ...orderRes.data,
        total_price: totalPrice,
      };
      setOrderReadyForPayment(preparedOrder);

      return preparedOrder; // ✅ return it so startPayment gets a valid order
    } catch (err) {
      console.error("Order creation failed", err);
      alert("Failed to create order");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Close modal & reset all
    setShowCreateModal(false);
    setOrderReadyForPayment(null);
    resetForm();

    // Refresh orders in dashboard
    fetchOrders();
  };
  const resetForm = () => {
    setSelectedShop("");
    setShopOptions(null);
    setSelectedFile(null);
    setPaperType("");
    setColorMode("");
    setFinishType("");
    setPageCount(1);
    setCopies(1);
    setOrientation("portrait");
    setIsUrgent(false);
  };

  const selectedPaper = shopOptions?.paper_types?.find(
    (p) => p.id === paperType
  );

  const selectedColor = shopOptions?.color_modes?.find(
    (c) => c.id === colorMode
  );

  const selectedFinish = shopOptions?.finish_types?.find(
    (f) => f.id === finishType
  );

  const totalPrice = (() => {
    if (!selectedPaper) return 0;

    const paperPrice = Number(selectedPaper.base_price || 0);
    const colorPrice = Number(selectedColor?.extra_price || 0);
    const finishPrice = Number(selectedFinish?.extra_price || 0);

    const base =
      (paperPrice + colorPrice + finishPrice) *
      Number(pageCount) *
      Number(copies);

    return isUrgent ? base + URGENCY_FEE : base;
  })();
  const canSubmit =
    selectedShop && paperType && colorMode && finishType && selectedFile;

  const getPdfPageCount = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header1">
        <img src={logo} alt="Lovely Prints" className="dashboard-logo" />
        <button onClick={() => setShowCreateModal(true)}>
          + Create New Print Order
        </button>
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
                      {/* Orientation */}
                      {order.orientation && (
                        <span className="order-meta_k">
                          {" "}
                          •{" "}
                          {order.orientation === "portrait"
                            ? "Portrait"
                            : "Landscape"}
                        </span>
                      )}
                      {/* Urgent badge */}
                      {order.is_urgent && (
                        <span className="order-urgent_k"> • ( Urgent )</span>
                      )}
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
                <span className="order-date-k">
                  {new Date(order.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
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
            {/* Orientation */}
            <label>
              Orientation
              <select
                className="modal-input1"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>

            {/* Page Count */}
            <label>
              Page Count
              <input
                type="number"
                className="modal-input1"
                value={pageCount}
                readOnly
              />
            </label>

            {/* Copies */}
            <label>
              No. of copies
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
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setSelectedFile(file);

                  // 🔥 Auto-detect page count
                  try {
                    const pages = await getPdfPageCount(file);
                    setPageCount(pages);
                  } catch (err) {
                    console.error("Failed to read PDF pages", err);
                    alert("Unable to read page count from PDF");
                  }
                }}
              />
            </label>
            {/* Urgent Print */}
            <label className="urgent-toggle">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Urgent print (+₹10)</span>
            </label>

            {selectedFile && (
              <div className="upload-filename1">{selectedFile.name}</div>
            )}
            {selectedPaper && (
              <div className="price-preview">
                <p>
                  <strong>Price Breakdown</strong>
                </p>
                <p>Paper: ₹{selectedPaper.base_price}</p>
                <p>Color: ₹{selectedColor?.extra_price || 0}</p>
                <p>Finish: ₹{selectedFinish?.extra_price || 0}</p>
                {isUrgent && <p>Urgent: ₹{URGENCY_FEE}</p>}

                <hr />
                <p>
                  <strong>Total: ₹{totalPrice}</strong>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions">
              {submitting ? (
                <button className="submit-btn1" disabled>
                  Processing...
                </button>
              ) : !selectedFile || !canSubmit ? (
                <button className="submit-btn1" disabled>
                  Fill all details
                </button>
              ) : (
                <button
                  className="submit-btn1"
                  onClick={async () => {
                    try {
                      // 1️⃣ Submit order and prepare for payment
                      const order = await handleSubmitOrderAndPreparePayment();

                      // 2️⃣ Once order is ready, start Razorpay payment
                      await startPayment(order, handlePaymentSuccess);
                    } catch (err) {
                      console.error(
                        "Error submitting order or processing payment",
                        err
                      );
                      alert("Something went wrong. Please try again.");
                    }
                  }}
                >
                  Submit & Proceed to Pay
                </button>
              )}

              <button
                className="cancel-btn1"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
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
