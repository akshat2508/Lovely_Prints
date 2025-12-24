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
        className="order-preview"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="preview-header">
          <h3>Order Details</h3>
          <button className="preview-close" onClick={onClose}>×</button>
        </div>

        {/* Order Meta */}
        <div className="preview-section meta">
          <div className="preview-row">
            <span className="preview-label">Order No</span>
            <span>#{order.orderNo}</span>
          </div>

          <span className={`status-badge ${order.status}`}>
            {order.status}
          </span>
        </div>

        {/* Student Info */}
        <div className="preview-section student">
          <h4>Student Information</h4>

          <div className="preview-row">
            <span className="preview-label">Name</span>
            <span>{order.studentName || '—'}</span>
          </div>

          <div className="preview-row">
            <span className="preview-label">Student ID</span>
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
            <span className="spec-pill">Paper: {order.paperType}</span>
            <span className="spec-pill">Color: {order.colorMode}</span>
            <span className="spec-pill">Finish: {order.finishType}</span>
            <span className="spec-pill">Copies: {order.copies}</span>
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
        <div className="preview-actions">
          <button
            className="preview-download"
            onClick={handleDownload}
          >
            Download Document
          </button>
        </div>
      </div>
    </div>
  );
}
