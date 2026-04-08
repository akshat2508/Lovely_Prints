import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService";
import { startPayment } from "../Payments";
import "./createOrderModal.css";
import { PDFDocument } from "pdf-lib";
import FilePreviewModal from "./FilePreviewModal";
import Convertor from "../skeletons/Converter";
import PrintStackLoader from "../skeletons/PrintStackLoader";

const WalkInOrderPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [printstackLoader , setPrintStackLoader] = useState(false);
  const getPdfPageCount = async (file) => {
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
      });

      return pdf.getPageCount();
    } catch (err) {
      console.error("PDF page count error:", err);
      return 1; // fallback
    }
  };
  const canSubmit = selectedFile && amount && Number(amount) > 0 && !loading;
  const calculatePlatformFee = (amount) => {
    return amount < 100 ? 1 : 2;
  };

  const documentPrice = Number(amount) || 0;
  const platformFee = calculatePlatformFee(documentPrice);
  const totalPrice = documentPrice + platformFee;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setPrintStackLoader(true);

      const orderRes = await createStudentOrder({
        shop_id: shopId,
        order_type: "walk_in",
        notes: notes?.trim() || null,
      });

      if (!orderRes.success) {
        alert(orderRes.message);
        setPrintStackLoader(false);
        return;
      }

      const order = orderRes.data;

      const uploadRes = await uploadFile(selectedFile);
      const fileKey = uploadRes.data.fileKey;

      await attachDocumentToOrder(order.id, {
        fileKey,
        fileName: selectedFile.name,
        page_count: pageCount,
        manual_price: Number(amount),
      });

      startPayment(
        { ...order, total_price: totalPrice },
        () => navigate("/student/orders"),
        (reason) => {
          alert(reason || "Payment failed");
          setPrintStackLoader(false);
        },
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setPrintStackLoader(false);
    }
  };

  const convertToPDF = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${import.meta.env.VITE_CONVERTER_URL}/convert`, {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CONVERTER_API_KEY,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const blob = await res.blob();

    return new File([blob], file.name.replace(/\.\w+$/, ".pdf"), {
      type: "application/pdf",
    });
  };

  return (
    <div className="create-order-page">
      {loading && <Convertor />}
      {printstackLoader && <PrintStackLoader/>}
      {showPreview && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="create-order-container">
        <h1 className="container-header">Walk-In Order</h1>
        <p>Upload file and enter amount told by shop owner.</p>

        <div className="form-group full-width">
          <label className="modal-label">Upload File *</label>

          <label className="upload-box">
            <span
              onClick={() => selectedFile && setShowPreview(true)}
              style={{ cursor: selectedFile ? "pointer" : "default" }}
            >
              {selectedFile ? selectedFile.name : "Choose a File"}
            </span>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const MAX_SIZE = 10 * 1024 * 1024;
                const ext = file.name.split(".").pop().toLowerCase();

                const extToMime = {
                  jpg: "image/jpeg",
                  jpeg: "image/jpeg",
                  png: "image/png",
                  pdf: "application/pdf",
                  doc: "application/msword",
                  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                };

                let finalType = file.type;

                if (!finalType || finalType === "application/octet-stream") {
                  finalType = extToMime[ext];
                }

                if (!finalType) {
                  setFileError("Unsupported file type.");
                  setSelectedFile(null);
                  return;
                }

                if (file.size > MAX_SIZE) {
                  setFileError("File must be under 10MB.");
                  setSelectedFile(null);
                  return;
                }

                setFileError("");

                try {
                  let processedFile = new File([file], file.name, {
                    type: finalType,
                  });

                  // 🔥 HANDLE CONVERSION
                  if (
                    finalType.includes("wordprocessingml") ||
                    finalType === "application/msword" ||
                    finalType.includes("spreadsheetml")
                  ) {
                    setLoading(true);

                    processedFile = await convertToPDF(processedFile);

                    // 🔥 WAIT a bit (IMPORTANT for correct parsing)
                    await new Promise((res) => setTimeout(res, 300));
                  }

                  // ✅ NOW detect pages
                  let pages = 1;

                  if (processedFile.type === "application/pdf") {
                    pages = await getPdfPageCount(processedFile);
                  }

                  setSelectedFile(processedFile);
                  setPageCount(pages);
                } catch (err) {
                  console.error(err);
                  setFileError("File processing failed");
                  setSelectedFile(null);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </label>
          {selectedFile && !fileError && (
            <button
              type="button"
              className="secondary-btn"
              style={{ marginTop: "10px" }}
              onClick={() => setShowPreview(true)}
            >
              Preview File
            </button>
          )}
          <p>Page count {pageCount}</p>

          {fileError && <p className="error-text">{fileError}</p>}
        </div>

        <div className="form-group">
          <label className="modal-label">Amount (₹) *</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="modal-input"
          />
        </div>

        <div className="form-group">
          <label className="modal-label">Notes (Optional)</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="modal-input"
          />
        </div>
        {documentPrice > 0 && (
          <div className="summary-card" style={{ marginTop: "20px" }}>
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Document Price</span>
              <span>₹{documentPrice}</span>
            </div>
            <div className="summary-row">
              <span>Page Count</span>
              <span>{pageCount}</span>
            </div>

            <div className="summary-row">
              <span>
                Platform Fee
                <span
                  title="Below ₹100 → ₹1 | ₹100 and above → ₹2"
                  style={{ marginLeft: "6px", cursor: "pointer" }}
                >
                  ⓘ
                </span>
              </span>
              <span>+₹{platformFee}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}

        <div className="create-footer-A">
          <button className="secondary-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button
            className="primary-btn-n"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkInOrderPage;
