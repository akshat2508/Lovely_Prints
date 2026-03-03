import { useState , useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { useParams, useNavigate } from "react-router-dom";

import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService";
import { useStudentData } from "../context/StudentDataContext";

import { startPayment } from "../Payments";
import "./createOrderModal.css";
import PrintStackLoader from "../skeletons/PrintStackLoader";

const URGENCY_FEE = 10;

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;

  const parts = timeStr.split(":");
  if (parts.length < 2) return null;

  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return null; 

  return h * 60 + m;
};

const getMinutesFromDate = (date) => date.getHours() * 60 + date.getMinutes();

const CreateOrderPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { shops, fetchShops, fetchShopOptions, setFlowStage } = useStudentData();
  const [shop, setShop] = useState(null);
  const [shopOptions, setShopOptions] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      const allShops = shops || (await fetchShops());
      const found = allShops?.find(s => String(s.id) === String(shopId));
      setShop(found);
  
      const opts = await fetchShopOptions(shopId);
      setShopOptions(opts);
    };
  
    loadData();
  }, [shopId]);
  useEffect(() => {
  // Modal starts at Print Options (Sidebar Step 2)
  setFlowStage(currentStep + 1);
}, [currentStep]);



  /* ====== Print Config ====== */
  const [paperType, setPaperType] = useState("");
  const [colorMode, setColorMode] = useState("");
  const [finishType, setFinishType] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [copies, setCopies] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [description, setDescription] = useState("");

  /* ====== File ====== */
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(1);

  /* ====== Submit State ====== */
  const [submitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("Preparing your documents…");
  const [fileError, setFileError] = useState("");

  /* ====== Pickup Time ====== */
  const [pickupAt, setPickupAt] = useState("");
  const [pickupError, setPickupError] = useState("");

  const [selectedDay, setSelectedDay] = useState("today");
const [selectedTime, setSelectedTime] = useState(null);



  /* ====== Helpers ====== */
  const selectedPaper = shopOptions?.paper_types?.find(
    (p) => p.id === paperType,
  );
  const selectedColor = shopOptions?.color_modes?.find(
    (c) => c.id === colorMode,
  );
  const selectedFinish = shopOptions?.finish_types?.find(
    (f) => f.id === finishType,
  );

  const totalPrice = (() => {
    if (!selectedPaper) return 0;
    const basePrice = Number(selectedPaper.base_price || 0);
    const colorPrice = Number(selectedColor?.extra_price || 0);
    const finishPrice = Number(selectedFinish?.extra_price || 0);

    const subtotal =
      (basePrice + colorPrice + finishPrice) * pageCount * copies;
    return isUrgent ? subtotal + URGENCY_FEE : subtotal;
  })();

  /* ✅ Step validation */
  const canProceedStep1 =
    paperType && colorMode && finishType && orientation && copies > 0;

  const canProceedStep2 =
    selectedFile && !fileError && pickupAt && !pickupError;

  const canSubmit =
    canProceedStep1 && canProceedStep2 && !submitting && !disableSubmit;

  const getPdfPageCount = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
  };
  const generateTimeSlots = () => {
  const openMinutes = parseTimeToMinutes(shop.open_time);
  const closeMinutes = parseTimeToMinutes(shop.close_time);

  if (openMinutes === null || closeMinutes === null) return [];

  const slots = [];
  const interval = 30; // 30 min intervals (professional standard)

  let start = openMinutes;

  if (selectedDay === "today") {
    const nowMinutes = getMinutesFromDate(new Date());
    start = Math.max(openMinutes, nowMinutes + 15); 
  }

  for (let mins = start; mins < closeMinutes; mins += interval) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    const formatted = new Date(0, 0, 0, hours, minutes)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    slots.push({
      label: formatted,
      hours,
      minutes
    });
  }

  return slots;
};
useEffect(() => {
  if (!selectedTime) return;

  const baseDate = new Date();
  if (selectedDay === "tomorrow") {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  baseDate.setHours(selectedTime.hours);
  baseDate.setMinutes(selectedTime.minutes);
  baseDate.setSeconds(0);

  setPickupAt(baseDate.toISOString());
  setPickupError("");
}, [selectedTime, selectedDay]);



  /* ====== Submit Handler ====== */
  const handleSubmitAndPay = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setDisableSubmit(true);
    setShowLoader(true);
    setLoaderText("Preparing your documents…");

    try {
      const orderRes = await createStudentOrder({
        shop_id: shop.id,
        organisation_id: shop.organisation_id,
        description: description?.trim() || null,
        orientation,
        is_urgent: isUrgent,
        pickup_at: new Date(pickupAt).toISOString(),
      });

      const order = orderRes.data;

      const uploadRes = await uploadFile(selectedFile);
      const fileKey = uploadRes.data.fileKey;

      await attachDocumentToOrder(order.id, {
        fileKey,
        fileName: selectedFile.name,
        page_count: pageCount,
        copies,
        paper_type_id: paperType,
        color_mode_id: colorMode,
        finish_type_id: finishType,
      });

      setLoaderText("Redirecting to payment gateway…");

      startPayment(
        { ...order, total_price: totalPrice },
        // ✅ success
        () => {
          setShowLoader(false);
          setFlowStage(5);
           navigate("/student/orders");
        },
        // ❌ failure / cancel
        (reason) => {
          setShowLoader(false);
          setDisableSubmit(false);
          setSubmitting(false);
          alert(reason || "Payment not completed");
        },
      );
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("RESPONSE DATA:", err?.response?.data);

      setShowLoader(false);
      setSubmitting(false);
      setDisableSubmit(false);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to place order",
      );
    }
  };


const isUrgentDisabled = (() => {
  if (!selectedTime) return true;

  const pickup = new Date(pickupAt);
  const pickupMinutes = getMinutesFromDate(pickup);
  const closeMinutes = parseTimeToMinutes(shop.close_time);

  return closeMinutes - pickupMinutes < 60;
})();

  // const shopIsClosedNow = (() => {
  //   const openMinutes = parseTimeToMinutes(shop?.open_time);
  //   const closeMinutes = parseTimeToMinutes(shop?.close_time);

  //   if (openMinutes === null || closeMinutes === null) return false;

  //   const nowMinutes = getMinutesFromDate(new Date());
  //   return nowMinutes < openMinutes || nowMinutes >= closeMinutes;
  // })();
  
const shopNotAcceptingOrders = shop?.is_accepting_orders === false;

if (!shop || !shopOptions) {
  return (
    <div className="create-order-page">
      <div className="create-order-container">
        <p className="muted">Loading shop data…</p>
      </div>
    </div>
  );
}
  return (
  <div className="create-order-page">
    {showLoader && <PrintStackLoader />}

    <div className="create-order-container">

      {/* HEADER */}
      <div className="create-header">
        <div>
          <h1>Create Print Order</h1>
          <p>
            {shop.shop_name} • {shop.open_time.slice(0, 5)}–
            {shop.close_time.slice(0, 5)}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="modal-progress">
        {[2, 3, 4].map((stage, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div
              key={stage}
              className={`progress-step 
                ${isActive ? "active" : ""} 
                ${isCompleted ? "completed" : ""}`}
            >
              <div className="progress-dot" />
              <span className="progress-label">
                {stage === 2 && "Print Options"}
                {stage === 3 && "Upload & Pickup"}
                {stage === 4 && "Review Order"}
              </span>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="create-main-grid">

        {/* LEFT SIDE */}
        <div className="create-left">
          <div className="step-card">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="step-form">
                <h3 className="step-title">Configure Print Settings</h3>

                <div className="form-group">
                  <label className="modal-label">Paper Type *</label>
                  <select
                    className="modal-input"
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value)}
                  >
                    <option value="">Select Paper</option>
                    {shopOptions.paper_types.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="modal-label">Color Mode *</label>
                  <select
                    className="modal-input"
                    value={colorMode}
                    onChange={(e) => setColorMode(e.target.value)}
                  >
                    <option value="">Select Mode</option>
                    {shopOptions.color_modes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="modal-label">Finish Type *</label>
                  <select
                    className="modal-input"
                    value={finishType}
                    onChange={(e) => setFinishType(e.target.value)}
                  >
                    <option value="">Select Finish</option>
                    {shopOptions.finish_types.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="modal-label">Orientation *</label>
                  <select
                    className="modal-input"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="modal-label">Copies *</label>
                  <input
                    className="modal-input"
                    type="number"
                    min={1}
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="step-form">
                <h3 className="step-title">Upload & Pickup</h3>

                <div className="form-group full-width">
                  <label className="modal-label">Upload PDF *</label>
                  <label className="upload-box">
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a PDF (max 10MB)"}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const MAX_SIZE = 10 * 1024 * 1024;
                        if (file.size > MAX_SIZE) {
                          setFileError("PDF must be under 10MB.");
                          return;
                        }

                        setFileError("");
                        setSelectedFile(file);

                        try {
                          const pages = await getPdfPageCount(file);
                          setPageCount(pages);
                        } catch {
                          setFileError("Invalid PDF file.");
                        }
                      }}
                    />
                  </label>
                  {fileError && <p className="error-text">{fileError}</p>}
                </div>

                <div className="form-group full-width">
  <label className="modal-label">Select Pickup Day *</label>

  <div className="day-toggle">
    <button
      type="button"
      className={selectedDay === "today" ? "day-btn active" : "day-btn"}
      onClick={() => {
        setSelectedDay("today");
        setSelectedTime(null);
      }}
    >
      Today
    </button>

    <button
      type="button"
      className={selectedDay === "tomorrow" ? "day-btn active" : "day-btn"}
      onClick={() => {
        setSelectedDay("tomorrow");
        setSelectedTime(null);
      }}
    >
      Tomorrow
    </button>
  </div>
</div>

<div className="form-group full-width">
  <label className="modal-label">Select Time *</label>

  <div className="time-grid">
    {generateTimeSlots().map((slot, index) => (
      <button
        key={index}
        type="button"
        className={
          selectedTime?.label === slot.label
            ? "time-slot active"
            : "time-slot"
        }
        onClick={() => setSelectedTime(slot)}
      >
        {slot.label}
      </button>
    ))}
  </div>

  {generateTimeSlots().length === 0 && (
    <p className="error-text">No pickup slots available</p>
  )}
</div>


                <div className="form-group">
                  <label className="urgent-toggle-A">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      disabled={isUrgentDisabled}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                    />
                    <span>Urgent (+₹{URGENCY_FEE})</span>
                  </label>
                </div>

                <div className="form-group full-width">
                  <label className="modal-label">
                    Additional Instructions
                  </label>
                  <textarea
                    className="modal-input"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3 (UNCHANGED LOGIC) */}
            {currentStep === 3 && (
              <div className="step-form">
                <h3 className="step-title">Review Order</h3>

                <div className="review-section">
                  <div className="review-item">
                    <span>Paper</span>
                    <span>{selectedPaper?.name}</span>
                  </div>
                  <div className="review-item">
                    <span>Pages</span>
                    <span>{pageCount}</span>
                  </div>
                  <div className="review-item">
                    <span>Copies</span>
                    <span>{copies}</span>
                  </div>
                  <div className="review-item">
                    <span>Pickup</span>
                    <span>{new Date(pickupAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="create-right">
          <div className="summary-card">
            <h3>Order Summary</h3>

            {selectedPaper && (
              <>
                <div className="summary-row">
                  <span>Paper</span>
                  <span>{selectedPaper.name}</span>
                </div>

                <div className="summary-row">
                  <span>Pages × Copies</span>
                  <span>{pageCount} × {copies}</span>
                </div>

                {isUrgent && (
                  <div className="summary-row">
                    <span>Urgent</span>
                    <span>+₹{URGENCY_FEE}</span>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="create-footer-A">
        {currentStep > 1 && (
          <button
            className="secondary-btn"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Back
          </button>
        )}

        {currentStep < 3 ? (
          <button
            className="primary-btn-n"
            disabled={
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2)
            }
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="primary-btn-n"
            disabled={!canSubmit || shopNotAcceptingOrders}
            onClick={handleSubmitAndPay}
          >
            Submit & Pay
          </button>
        )}

        <button
          className="cancel-btn1"
          onClick={() => {
            setFlowStage(2);
            navigate(`/student/shop/${shopId}`);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

};

export default CreateOrderPage;