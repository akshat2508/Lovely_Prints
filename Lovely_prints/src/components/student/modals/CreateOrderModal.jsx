import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService";

import { startPayment } from "../Payments";
import "../dashboard.css";
import PrintStackLoader from "../skeletons/PrintStackLoader";

const URGENCY_FEE = 10;

const CreateOrderModal = ({ shop, shopOptions, onClose, onSuccess }) => {
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

  /* ✅ Button is enabled only if all required fields are filled */
  const canSubmit =
    paperType &&
    colorMode &&
    finishType &&
    selectedFile &&
    copies > 0 &&
    !submitting &&
    !disableSubmit &&
    !fileError;

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
        description: description?.trim() || null,
        orientation,
        is_urgent: isUrgent,
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
      console.error(err);
      setShowLoader(false);
      setSubmitting(false);
      setDisableSubmit(false);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="modal-overlay">
      {showLoader && <PrintStackLoader />}
      <div className="modal-card large">
        <h2>Create Order — {shop.shop_name}</h2>

        {/* ===== Paper Type ===== */}
        <label className="modal-label">Select Paper Type</label>
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

        {/* ===== Color Mode ===== */}
        <label className="modal-label">Select Color Mode</label>
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

        {/* ===== Finish Type ===== */}
        <label className="modal-label">Select Finish Type</label>
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

        {/* ===== Orientation ===== */}
        <label className="modal-label">Orientation</label>
        <select
          className="modal-input"
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>

        {/* ===== Copies ===== */}
        <label className="modal-label">Number of Copies</label>
        <input
          className="modal-input"
          type="number"
          min={1}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
        />

        {/* ===== Upload File ===== */}
        <label className="modal-label">Upload PDF Document</label>
        <label className="upload-box">
          {selectedFile ? selectedFile.name : `Choose a PDF file (size <= 10 mb)`}
          <input
            type="file"
            accept=".pdf"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              // ✅ 10 MB limit
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
        {fileError && (
          <p id="error-text">{fileError}</p>
        )}


        {/* ===== Number of Pages ===== */}
        {selectedFile && (
          <div className="page-count-box">
            <p>
              <strong>Pages in Document:</strong> {pageCount}
            </p>
          </div>
        )}

        {/* ===== Urgent Toggle ===== */}
        <label className="urgent-toggle">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-text">Urgent (+₹{URGENCY_FEE})</span>
        </label>

        {/* ===== Additional Instructions ===== */}
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

        {/* ===== Price Breakdown ===== */}
        {selectedPaper && (
          <div className="price-breakdown">
            <h4>Price Breakdown</h4>

            <div className="price-row">
              <span className="price-label">Paper ({selectedPaper.name})</span>
              <span className="price-value">₹{selectedPaper.base_price}</span>
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

        {/* ===== Actions ===== */}
        <div className="modal-actions">
          <button
            className={`primary-btn ${!canSubmit ? "disabled-btn" : ""}`}
            disabled={!canSubmit}
            onClick={handleSubmitAndPay}
          >
            {submitting ? "Processing..." : "Submit & Pay"}
          </button>
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
