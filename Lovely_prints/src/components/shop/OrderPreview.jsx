import React from "react";
import { getDocumentDownloadUrl } from "../../services/shopService";
import "./OrderPreview-L.css"
import { createPortal } from "react-dom";

export default function OrderPreview({ order, onClose }) {
  if (!order) return null;

  const handleDownload = async () => {
    try {
      const url = await getDocumentDownloadUrl(order.documentId);
      window.open(url, "_blank");
    } catch {
      alert("Failed to download document");
    }
  };
    const modalRoot = document.getElementById("modal-root");

  return createPortal(
    <div className="order-preview-overlay-L" onClick={onClose}>
      <div
        className={`order-preview-L ${
          order.isHandled ? "urgent-preview-L" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (fixed inside modal) */}
        <div className="preview-header-L">
          <h3>Order Details</h3>
          <button className="preview-close-L" onClick={onClose}>
            ×
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="preview-body-L">

          {/* Customer */}
          <div className="preview-section-L">
            <h4>Customer Information</h4>

            <div className="preview-row-L">
              <span className="preview-label-L">Name</span>
              <span>{order.studentName || "—"}</span>
            </div>

            <div className="preview-row-L">
              <span className="preview-label-L">Order ID</span>
              <span>{order.id|| "—"}</span>
            </div>
          </div>

          {/* Document */}
          <div className="preview-section-L">
            <h4>Document</h4>

            <div className="preview-row-L">
              <span className="preview-label-L">File</span>
              <span>{order.documentName}</span>
            </div>
          </div>

          {/* Document */}
          <div className="preview-section-L">
            <h4>Copies</h4>

            <div className="preview-row-L">
              <span className="preview-label-L">Number of Copies</span>
              <span>{order.copies}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="preview-section-L">
            <h4>Print Specifications</h4>

            <div className="preview-specs-L">
              <span className="spec-pill-L">
                <span className="spec-label-L">Paper:</span>
                <span className="spec-value-L">{order.paperType}</span>
              </span>

              <span className="spec-pill-L">
                <span className="spec-label-L">Color:</span>
                <span className="spec-value-L">{order.colorMode}</span>
              </span>

              <span className="spec-pill-L">
                <span className="spec-label-L">Finish:</span>
                <span className="spec-value-L">{order.finishType}</span>
              </span>

              <span className="spec-pill-L">
                <span className="spec-label-L">Print Side:</span>
                <span className="spec-value-L">{order.printSide}</span>
              </span>

              <span className="spec-pill-L">
                <span className="spec-label-L">Orientation:</span>
                <span className="spec-value-L">{order.orientation}</span>
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="preview-section-L">
            <h4>Additional Instructions</h4>

            <div className="notes-box-L">
              {order.notes ? (
                <p className="notes-text-L">{order.notes}</p>
              ) : (
                <p className="notes-empty-L">No additional instructions</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="preview-section-L">
            <div className="preview-row-L">
              <span className="preview-label-L">Order No</span>
              <span className="order-no-highlight-L">
                #{order.orderNo}
              </span>
            </div>

            <div className="preview-row-L">
              <span className="preview-label-L">Status</span>
              <span className={`status-badge-L ${order.status}`}>
                {order.status}
              </span>
            </div>
            <div className="preview-row-L">
              <span className="preview-label-L">Amount</span>
              <span className={`order-no-highlight-L`}>
                {order.docPrice}
              </span>
            </div>

            <div className="preview-row-L">
              <span className="preview-label-L">Placed At</span>
              <span>
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* ACTION FOOTER */}
        {order.isPaid && (
          <div className="preview-actions-L">
            <button
              className="preview-download-L"
              onClick={handleDownload}
              disabled={order.status === "completed"}
            >
              {order.status === "completed"
                ? "Completed"
                : "Download Document"}
            </button>
          </div>
        )}
      </div>
    </div>,
    modalRoot
  );
}
