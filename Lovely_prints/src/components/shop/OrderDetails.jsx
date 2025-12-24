import React, { useState } from "react";
import { getDocumentDownloadUrl } from "../../services/shopService";

export default function OrderDetails({ order, onStatusChange, onClick }) {
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getNextStatus = (status) => {
    const flow = {
      pending: "confirmed",
      confirmed: "printing",
      printing: "ready",
      ready: "completed",
    };
    return flow[status];
  };

  const getActionLabel = (status) => {
    const labels = {
      pending: "Confirm",
      confirmed: "Start Printing",
      printing: "Mark Ready",
      ready: "Complete",
    };
    return labels[status];
  };

  const nextStatus = getNextStatus(order.status);

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const url = await getDocumentDownloadUrl(order.documentId);
      window.open(url, "_blank");
    } catch {
      alert("Failed to download document");
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.stopPropagation();
    setUpdating(true);
    await onStatusChange(order.id, nextStatus);
    setUpdating(false);
  };

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-header">
        <div className="order-id">#{order.orderNo}</div>
        <span className={`status-badge ${order.status}`}>
          {order.status}
        </span>
      </div>

      <div className="order-body">
        <div className="student-info">
          <h3>{order.studentName}</h3>
          <p>{order.studentId}</p>
        </div>

        <div className="document-info">
          <p>{order.documentName}</p>
          <button
            className="download-button"
            disabled={downloading}
            onClick={handleDownload}
          >
            {downloading ? "Preparing..." : "Download"}
          </button>
        </div>

        <div className="print-details">
          <span>Paper: {order.paperType}</span>
          <span>Color: {order.colorMode}</span>
          <span>Finish: {order.finishType}</span>
          <span>Copies: {order.copies}</span>
        </div>

        {nextStatus && (
          <button
            className="action-button"
            disabled={updating}
            onClick={handleStatusUpdate}
          >
            {updating ? "Updating..." : getActionLabel(order.status)}
          </button>
        )}
      </div>
    </div>
  );
}
