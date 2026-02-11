import { useState , useEffect } from "react";
import { PDFDocument } from "pdf-lib";

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

const CreateOrderModal = ({ shop, shopOptions, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => {
  // Modal starts at Print Options (Sidebar Step 2)
  setFlowStage(currentStep + 1);
}, [currentStep]);


  if (!shop?.open_time || !shop?.close_time) {
    return (
      <div className="modal-overlay">
        <div className="modal-card large">
          <p className="muted">Loading shop timings…</p>
        </div>
      </div>
    );
  }
const { setFlowStage } = useStudentData();

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
          onSuccess();
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

  const now = new Date();

  const minPickup = new Date(now);
  minPickup.setMinutes(0, 0, 0);

  const maxPickup = new Date(now);
  maxPickup.setDate(maxPickup.getDate() + 1);

  if (shop?.close_time) {
    const [h, m] = shop.close_time.split(":");
    maxPickup.setHours(Number(h), Number(m), 0, 0);
  }

  const toLocalInputValue = (date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

  const validatePickupTime = (value) => {
    if (!value) return "Pickup date & time is required";

    const selected = new Date(value);
    if (isNaN(selected.getTime())) {
      return "Invalid pickup date & time";
    }

    const now = new Date();
    if (selected < now) {
      return "Pickup time cannot be in the past";
    }

    const openMinutes = parseTimeToMinutes(shop?.open_time);
    const closeMinutes = parseTimeToMinutes(shop?.close_time);

    if (openMinutes === null || closeMinutes === null) {
      return "";
    }

    const selectedMinutes = getMinutesFromDate(selected);

    if (selectedMinutes < openMinutes || selectedMinutes >= closeMinutes) {
      return `Pickup allowed only between ${shop.open_time.slice(
        0,
        5,
      )} and ${shop.close_time.slice(0, 5)}`;
    }

    return "";
  };

  const isUrgentDisabled = (() => {
    if (!pickupAt) return false;

    const pickup = new Date(pickupAt);
    const pickupMinutes = getMinutesFromDate(pickup);
    const closeMinutes = parseTimeToMinutes(shop.close_time);

    return closeMinutes - pickupMinutes < 60;
  })();

  const shopIsClosedNow = (() => {
    const openMinutes = parseTimeToMinutes(shop?.open_time);
    const closeMinutes = parseTimeToMinutes(shop?.close_time);

    if (openMinutes === null || closeMinutes === null) return false;

    const nowMinutes = getMinutesFromDate(new Date());
    return nowMinutes < openMinutes || nowMinutes >= closeMinutes;
  })();

  return (
    <div className="modal-overlay">
      {showLoader && <PrintStackLoader />}
      <div className="modal-card large">
        <div className="modal-header">
          <h2>Create Order</h2>
          <p className="modal-subtitle">
            {shop.shop_name} • {shop.open_time.slice(0, 5)}–
            {shop.close_time.slice(0, 5)}
          </p>
        </div>

        {/* Step Indicator */}
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


        <div className="step-content">
          {/* STEP 1: Print Options */}
          {currentStep === 1 && (
            <div className="step-form">
              <h3 className="step-title">Configure Print Settings</h3>

              {/* Paper Type */}
              <label className="modal-label">Select Paper Type *</label>
              <select
                className="modal-input"
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
              >
                <option value="">-- Choose Paper Type --</option>
                {shopOptions.paper_types.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Color Mode */}
              <label className="modal-label">Select Color Mode *</label>
              <select
                className="modal-input"
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value)}
              >
                <option value="">-- Choose Color Mode --</option>
                {shopOptions.color_modes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Finish Type */}
              <label className="modal-label">Select Finish Type *</label>
              <select
                className="modal-input"
                value={finishType}
                onChange={(e) => setFinishType(e.target.value)}
              >
                <option value="">-- Choose Finish Type --</option>
                {shopOptions.finish_types.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Orientation */}
              <label className="modal-label">Orientation *</label>
              <select
                className="modal-input"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>

              {/* Copies */}
              <label className="modal-label">Number of Copies *</label>
              <input
                className="modal-input"
                type="number"
                min={1}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
              />
            </div>
          )}

          {/* STEP 2: Upload & Pickup */}
          {currentStep === 2 && (
            <div className="step-form">
              <h3 className="step-title">Upload Document & Schedule Pickup</h3>

              {/* Upload File */}
              <label className="modal-label">Upload PDF Document *</label>
              <label className="upload-box">
                {selectedFile
                  ? selectedFile.name
                  : `Choose a PDF file (size <= 10 mb)`}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const MAX_SIZE = 10 * 1024 * 1024;

                    if (file.size > MAX_SIZE) {
                      setFileError("PDF size must be 10MB or less.");
                      setSelectedFile(null);
                      setPageCount(1);
                      return;
                    }

                    setFileError("");
                    setSelectedFile(file);

                    try {
                      const pages = await getPdfPageCount(file);
                      setPageCount(pages);
                    } catch {
                      setFileError("Unable to read PDF file.");
                      setSelectedFile(null);
                    }
                  }}
                />
              </label>
              {fileError && <p className="error-text">{fileError}</p>}

              {/* Number of Pages */}
              {selectedFile && (
                <div className="page-count-box">
                  <p id="para">
                    <strong>Pages in Document:</strong> {pageCount}
                  </p>
                </div>
              )}

              {/* Pickup Date & Time */}
              <label className="modal-label">
                Pickup Date & Time (within 24 hours) *
              </label>

              <input
                type="datetime-local"
                className="modal-input"
                value={pickupAt}
                min={toLocalInputValue(minPickup)}
                max={toLocalInputValue(maxPickup)}
                onChange={(e) => {
                  const value = e.target.value;
                  setPickupAt(value);
                  const error = validatePickupTime(value);
                  setPickupError(error);

                  if (!error && value) {
                    const pickup = new Date(value);
                    const pickupMinutes = getMinutesFromDate(pickup);
                    const closeMinutes = parseTimeToMinutes(shop.close_time);

                    if (closeMinutes - pickupMinutes < 60 && isUrgent) {
                      setIsUrgent(false);
                    }
                  }
                }}
              />

              {shop?.open_time && shop?.close_time && (
                <p className="muted-ug">
                  Pickup available between{" "}
                  <strong>{shop.open_time.slice(0, 5)}</strong> and{" "}
                  <strong>{shop.close_time.slice(0, 5)}</strong>
                </p>
              )}

              {pickupError && <p id="error-text">{pickupError}</p>}

              {/* Urgent Toggle */}
              <label className="urgent-toggle">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  disabled={isUrgentDisabled}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Urgent (+₹{URGENCY_FEE})</span>
              </label>
              {isUrgentDisabled && (
                <p className="muted-ug">
                  Urgent orders are unavailable close to closing time
                </p>
              )}

              {/* Additional Instructions */}
              <label className="modal-label">
                Additional Instructions (optional)
              </label>

              <textarea
                className="modal-input notes-input"
                placeholder="Any special instructions for the shop? (e.g. spiral binding, print cover page in color, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* STEP 3: Review Order */}
          {currentStep === 3 && (
            <div className="step-form">
              <h3 className="step-title">Review Your Order</h3>

              <div className="review-section">
                <div className="review-group">
                  <h4 className="review-heading">Print Settings</h4>
                  <div className="review-item">
                    <span className="review-label">Paper Type:</span>
                    <span className="review-value">{selectedPaper?.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Color Mode:</span>
                    <span className="review-value">{selectedColor?.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Finish Type:</span>
                    <span className="review-value">{selectedFinish?.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Orientation:</span>
                    <span className="review-value">
                      {orientation.charAt(0).toUpperCase() +
                        orientation.slice(1)}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Copies:</span>
                    <span className="review-value">{copies}</span>
                  </div>
                </div>

                <div className="review-group">
                  <h4 className="review-heading">Document & Pickup</h4>
                  <div className="review-item">
                    <span className="review-label">Document:</span>
                    <span className="review-value">{selectedFile?.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Pages:</span>
                    <span className="review-value">{pageCount}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Pickup Time:</span>
                    <span className="review-value">
                      {new Date(pickupAt).toLocaleString()}
                    </span>
                  </div>
                  {isUrgent && (
                    <div className="review-item urgent">
                      <span className="review-label">Urgent Order:</span>
                      <span className="review-value">Yes</span>
                    </div>
                  )}
                  {description && (
                    <div className="review-item">
                      <span className="review-label">Instructions:</span>
                      <span className="review-value">{description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              {selectedPaper && (
                <div className="price-breakdown">
                  <h4>Price Breakdown</h4>

                  <div className="price-row">
                    <span className="price-label">
                      Paper ({selectedPaper.name})
                    </span>
                    <span className="price-value">
                      ₹{selectedPaper.base_price}
                    </span>
                  </div>

                  {selectedColor?.extra_price && (
                    <div className="price-row">
                      <span className="price-label">
                        Color ({selectedColor.name})
                      </span>
                      <span className="price-value">
                        +₹{selectedColor.extra_price}
                      </span>
                    </div>
                  )}

                  {selectedFinish?.extra_price && (
                    <div className="price-row">
                      <span className="price-label">
                        Finish ({selectedFinish.name})
                      </span>
                      <span className="price-value">
                        +₹{selectedFinish.extra_price}
                      </span>
                    </div>
                  )}

                  <div className="price-row muted-row">
                    <span className="price-label">Pages × Copies</span>
                    <span className="price-value">
                      {pageCount} × {copies}
                    </span>
                  </div>

                  {isUrgent && (
                    <div className="price-row urgent-row">
                      <span className="price-label">Urgent Fee</span>
                      <span className="price-value">+₹{URGENCY_FEE}</span>
                    </div>
                  )}

                  <div className="price-divider" />

                  <div className="price-total-row">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="modal-actions-n">
          {currentStep > 1 && (
            <button
              className="secondary-btn"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              ← Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              className={`primary-btn-n ${
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2)
                  ? "disabled-btn"
                  : ""
              }`}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2)
              }
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className={`primary-btn-n ${
                !canSubmit || shopIsClosedNow ? "disabled-btn" : ""
              }`}
              disabled={!canSubmit || shopIsClosedNow}
              onClick={handleSubmitAndPay}
            >
              {shopIsClosedNow
                ? "Shop is currently closed"
                : submitting
                ? "Processing..."
                : "Submit & Pay"}
            </button>
          )}

          <button className="cancel-btn1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {showLoader && (
        <div className="print-loader-overlay">
          <div className="print-loader-card">
            <div className="paper-stack">
              <div className="paper p1"></div>
              <div className="paper p2"></div>
              <div className="paper p3"></div>
              <div className="paper p4"></div>
            </div>

            <p className="loader-text">{loaderText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderModal;