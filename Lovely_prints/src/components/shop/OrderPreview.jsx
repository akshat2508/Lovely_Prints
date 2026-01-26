import React from 'react';
import { getDocumentDownloadUrl } from '../../services/shopService';

export default function OrderPreview({ order, onClose }) {
  if (!order) return null;

  const handleDownload = async () => {
    try {
      const url = await getDocumentDownloadUrl(order.documentId);
      window.open(url, '_blank');
    } catch (err) {
      alert('Failed to download document');
    }
  };

  return (
    <div className="order-preview-overlay" onClick={onClose}>
        <div
          className={`order-preview ${order.isUrgent ? "urgent-preview" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >

        {/* Header */}
        <div className="preview-header">
          <h3>Order Details</h3>
          <button className="preview-close" onClick={onClose}>×</button>
        </div>

        

        {/* Student Info */}
        <div className="preview-section student">
          <h4>Customer Information</h4>

          <div className="preview-row">
            <span className="preview-label">Name</span>
            <span>{order.studentName || '—'}</span>
          </div>

          <div className="preview-row">
            <span className="preview-label">Customer ID</span>
            <span>{order.studentId || '—'}</span>
          </div>
        </div>

        {/* Document */}
        <div className="preview-section document">
          <h4>Document</h4>

          <div className="preview-row">
            <span className="preview-label">File</span>
            <span>{order.documentName}</span>
          </div>
        </div>

        {/* Print Specifications */}
        <div className="preview-section specs">
          <h4>Print Specifications</h4>

          <div className="preview-specs">
  <span className="spec-pill">
    <span className="spec-label">Paper:</span>
    <span className="spec-value">{order.paperType}</span>
  </span>

  <span className="spec-pill">
    <span className="spec-label">Color:</span>
    <span className="spec-value">{order.colorMode}</span>
  </span>

  <span className="spec-pill">
    <span className="spec-label">Finish:</span>
    <span className="spec-value">{order.finishType}</span>
  </span>

  <span className="spec-pill">
    <span className="spec-label">Copies:</span>
    <span className="spec-value">{order.copies}</span>
  </span>

  <span className="spec-pill">
    <span className="spec-label">Orientation:</span>
    <span className="spec-value">{order.orientation}</span>
  </span>
</div>

        </div>
        {/* Order Meta */}
        <div className="preview-section meta">
          <div className="preview-row order-no-row">
  <span className="preview-label">Order No</span>
  <span className="order-no-highlight">#{order.orderNo}</span>
</div>


            <div className='preview-row'>
            <span className="preview-label">Status</span>

          <span className={`status-badge ${order.status}`}>
            {order.status}
          </span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Order ID</span>
            <span>
              {`${order.id}`}
            </span>
          </div>
            
            <div className="preview-row">
            <span className="preview-label">Urgency</span>
            <span>
              {order.isUrgent ? `Urgent (+₹${order.urgencyFee})` : "NO"}
            </span>
          </div>

          <div className="preview-row">
            <span className="preview-label">Payment</span>
            <span>
              {order.isPaid ? `₹${order.totalPrice} (Paid)` : "Not Paid ❌"}
            </span>
          </div>

          {/* <div className="preview-row">
            <span className="preview-label">Orientation</span>
            <span>
              {order.orientation === "landscape" ? "Landscape" : "Portrait"}
            </span>
          </div> */}

          <div className="preview-row">
            <span className="preview-label">Placed At</span>
            <span>
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

        </div>

        {/* ETA (placeholder for now) */}
        <div className="preview-section eta">
          <div className="preview-row">
            <span className="preview-label">Estimated Time</span>
            <span>{order.eta}</span>
          </div>
        </div>

        {/* Actions */}
{order.isPaid && (
  <div className="preview-actions">
    <button
      className="preview-download"
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
    </div>
  );
}
