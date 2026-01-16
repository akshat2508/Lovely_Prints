import { useState } from "react";
import { PDFDocument } from "pdf-lib";

import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService";

import { startPayment } from "../Payments";
import "../dashboard.css";

const URGENCY_FEE = 10;

const CreateOrderModal = ({ shop, shopOptions, onClose, onSuccess }) => {
  /* ====== Print Config ====== */
  const [paperType, setPaperType] = useState("");
  const [colorMode, setColorMode] = useState("");
  const [finishType, setFinishType] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [copies, setCopies] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);

  /* ====== File ====== */
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(1);

  /* ====== Submit State ====== */
  const [submitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  /* ====== Helpers ====== */
  const selectedPaper = shopOptions?.paper_types?.find(p => p.id === paperType);
  const selectedColor = shopOptions?.color_modes?.find(c => c.id === colorMode);
  const selectedFinish = shopOptions?.finish_types?.find(f => f.id === finishType);

  const totalPrice = (() => {
    if (!selectedPaper) return 0;
    const basePrice = Number(selectedPaper.base_price || 0);
    const colorPrice = Number(selectedColor?.extra_price || 0);
    const finishPrice = Number(selectedFinish?.extra_price || 0);

    const subtotal = (basePrice + colorPrice + finishPrice) * pageCount * copies;
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
    !disableSubmit;

  const getPdfPageCount = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
  };

  /* ====== Submit Handler ====== */
  const handleSubmitAndPay = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setDisableSubmit(true); // Disable button immediately
    setTimeout(() => setDisableSubmit(false), 10000); // Re-enable after 10 sec

    try {
      const orderRes = await createStudentOrder({
        shop_id: shop.id,
        description: "Print order",
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

      await startPayment({ ...order, total_price: totalPrice }, onSuccess);
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
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
            <option key={p.id} value={p.id}>{p.name}</option>
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
            <option key={c.id} value={c.id}>{c.name}</option>
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
            <option key={f.id} value={f.id}>{f.name}</option>
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
          {selectedFile ? selectedFile.name : "Choose a PDF file"}
          <input
            type="file"
            accept=".pdf"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setSelectedFile(file);
              try {
                const pages = await getPdfPageCount(file);
                setPageCount(pages);
              } catch {
                alert("Unable to read PDF file");
              }
            }}
          />
        </label>

        {/* ===== Number of Pages ===== */}
        {selectedFile && (
          <div className="page-count-box">
            <p><strong>Pages in Document:</strong> {pageCount}</p>
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

        {/* ===== Price Breakdown ===== */}
        {selectedPaper && (
          <div className="price-breakdown">
            <h4>Price Breakdown</h4>
            <ul>
              <li>Paper ({selectedPaper.name}): ₹{selectedPaper.base_price}</li>
              {selectedColor && selectedColor.extra_price
                ? <li>Color ({selectedColor.name}): +₹{selectedColor.extra_price}</li>
                : null
              }
              {selectedFinish && selectedFinish.extra_price
                ? <li>Finish ({selectedFinish.name}): +₹{selectedFinish.extra_price}</li>
                : null
              }
              <li>Pages: {pageCount} × Copies: {copies}</li>
              {isUrgent && <li>Urgent Fee: +₹{URGENCY_FEE}</li>}
            </ul>
            <p className="total-price">Total: ₹{totalPrice}</p>
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
    </div>
  );
};

export default CreateOrderModal;
