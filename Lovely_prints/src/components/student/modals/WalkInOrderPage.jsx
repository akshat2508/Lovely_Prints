import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createStudentOrder,
  uploadFile,
  attachDocumentToOrder,
} from "../../../services/studentService";
import { startPayment } from "../Payments";
import PrintStackLoader from "../skeletons/PrintStackLoader";
import "./createOrderModal.css";
import { PDFDocument } from "pdf-lib";

const WalkInOrderPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const getPdfPageCount = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
  };

  const canSubmit = selectedFile && amount && Number(amount) > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);

      const orderRes = await createStudentOrder({
        shop_id: shopId,
        order_type: "walk_in",
        notes: notes?.trim() || null,
      });

      if (!orderRes.success) {
        alert(orderRes.message);
        setLoading(false);
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
        order,
        () => navigate("/student/orders"),
        (reason) => {
          alert(reason || "Payment failed");
          setLoading(false);
        },
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      {loading && <PrintStackLoader />}

      <div className="create-order-container">
        <h1 className="container-header">Walk-In Order</h1>
        <p>Upload file and enter amount told by shop owner.</p>

        <div className="form-group full-width">
          <label className="modal-label">Upload File *</label>

          <label className="upload-box">
            {selectedFile ? selectedFile.name : "Choose a File (max 10MB)"}

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
                };

                let finalType = file.type;

                // 🔥 Fix wrong/empty MIME
                if (!finalType || finalType === "application/octet-stream") {
                  finalType = extToMime[ext];
                }

                // ❌ Unsupported
                if (!finalType) {
                  setFileError("Unsupported file type.");
                  setSelectedFile(null);
                  return;
                }

                // ❌ Size check
                if (file.size > MAX_SIZE) {
                  setFileError("File must be under 10MB.");
                  setSelectedFile(null);
                  return;
                }

                // 🔥 FORCE correct MIME (MAIN FIX)
                const fixedFile = new File([file], file.name, { type: finalType });

                setFileError("");
                setSelectedFile(fixedFile);

                try {
                  if (finalType === "application/pdf") {
                    const pages = await getPdfPageCount(fixedFile);
                    setPageCount(pages);
                  } else {
                    setPageCount(1);
                  }
                } catch {
                  setFileError("Invalid file.");
                  setSelectedFile(null);
                }
              }}
            />
          </label>
          {selectedFile && !fileError && (
            <span className="pdf-info">
              📄 {pageCount} page{pageCount > 1 ? "s" : ""}
            </span>
          )}

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
