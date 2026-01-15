import React, { useState } from "react";
import { getDocumentDownloadUrl } from "../../services/shopService";
import { verifyOrderOtp } from "../../services/shopService";

export default function OrderDetails({ order, onStatusChange, onClick , onRefresh }) {
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
const [otp, setOtp] = useState("");
const [verifyingOtp, setVerifyingOtp] = useState(false);

const createdDate = new Date(order.createdAt);

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
  if (order.status === "completed") return;

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

  // 🔐 If completing order → OTP required
  if (nextStatus === "completed") {
    setShowOtpModal(true);
    return;
  }

  setUpdating(true);
  await onStatusChange(order.id, nextStatus);
  setUpdating(false);
};

const handleVerifyOtp = async () => {
  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    setVerifyingOtp(true);
    await verifyOrderOtp(order.id, otp);
    setShowOtpModal(false);
    setOtp("");

    // refresh order list
    // await onStatusChange(order.id, "completed");
    await onRefresh();
  } catch (err) {
    alert(
      err?.response?.data?.message || "Invalid OTP"
    );
  } finally {
    setVerifyingOtp(false);
  }
};


  return (
    <div className="order-card" onClick={onClick}>
     <div className="order-header">
  <div className="order-id">#{order.orderNo}</div>

  <span className={`status-badge ${order.status}`}>
    {order.status}
  </span>

  {order.isUrgent && (
    <span className="badge urgent">Urgent</span>
  )}

  <span className={`badge ${order.isPaid ? "paid" : "unpaid"}`}>
    {order.isPaid ? "Paid" : "Not Paid"}
  </span>
</div>


      <div className="order-body">
        <div className="student-info">
          <h3>{order.studentName}</h3>
          <p>{order.studentId}</p>
        </div>
        <div className="order-meta order-header">
      <span>📅 {createdDate.toLocaleDateString('en-IN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})}</span>

<span>⏰ {createdDate.toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit'
})}</span>
        </div>

       <div className="document-info">
  <p>{order.documentName}</p>
  <button
    className="download-button"
    disabled={!order.isPaid || order.status === "completed" || downloading}
    onClick={handleDownload}
  >
    {!order.isPaid
      ? "Not Paid"
      : order.status === "completed"
      ? "Completed"
      : downloading
      ? "Preparing..."
      : "Download"}
  </button>
</div>

        <div className="print-details">
          <span>Paper: {order.paperType}</span>
          <span>Color: {order.colorMode}</span>
          <span>Finish: {order.finishType}</span>
          <span>Copies: {order.copies}</span>
           {order.orientation === "landscape" ? "Landscape" : "Portrait"}
        </div>

        {nextStatus && order.isPaid && (
          <button
            className="action-button"
            disabled={updating}
            onClick={handleStatusUpdate}
          >
            {updating ? "Updating..." : getActionLabel(order.status)}
          </button>
        )}
      </div>
      {showOtpModal && (
  <div className="modal-overlay" onClick={() => setShowOtpModal(false)}>
    <div
      className="modal-card"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Enter Delivery OTP</h3>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit OTP"
        className="modal-input1"
        maxLength={6}
      />

      <div className="modal-actions">
        <button
          className="submit-btn1"
          disabled={verifyingOtp}
          onClick={handleVerifyOtp}
        >
          {verifyingOtp ? "Verifying..." : "Verify & Complete"}
        </button>

        <button
          className="cancel-btn1"
          onClick={() => setShowOtpModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
