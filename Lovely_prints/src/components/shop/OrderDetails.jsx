import React, { useState } from "react";
import {
  getDocumentDownloadUrl,
  verifyOrderOtp
} from "../../services/shopService";

export default function OrderDetails({
  order,
  onStatusChange,
  onClick,
  onRefresh,
  className = ""
}) {
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const createdDate = new Date(order.createdAt);

  /* ---------------- STATUS FLOW ---------------- */

  const getNextStatus = (status) => {
    const flow = {
      pending: "confirmed",
      confirmed: "printing",
      printing: "ready",
      ready: "completed"
    };
    return flow[status];
  };

  const getActionLabel = (status) => {
    const labels = {
      pending: "Confirm",
      confirmed: "Start Printing",
      printing: "Mark Ready",
      ready: "Complete"
    };
    return labels[status];
  };

  const nextStatus = getNextStatus(order.status);

  /* ---------------- DOWNLOAD + AUTO READY ---------------- */

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!order.isPaid || order.status === "completed") return;

    try {
      setDownloading(true);

      // 1️⃣ Download document
      const url = await getDocumentDownloadUrl(order.documentId);
      window.open(url, "_blank");

      // 2️⃣ Auto-move status → READY
      if (
        order.status === "confirmed" ||
        order.status === "printing"
      ) {
        setUpdating(true);
        await onStatusChange(order.id, "ready");
        await onRefresh();
      }
    } catch (err) {
      alert("Failed to download document");
    } finally {
      setDownloading(false);
      setUpdating(false);
    }
  };

  /* ---------------- MANUAL STATUS UPDATE ---------------- */

  const handleStatusUpdate = async (e) => {
    e.stopPropagation();

    // 🔐 OTP only for completion
    if (nextStatus === "completed") {
      setShowOtpModal(true);
      return;
    }

    try {
      setUpdating(true);
      await onStatusChange(order.id, nextStatus);
      await onRefresh();
    } finally {
      setUpdating(false);
    }
  };

  /* ---------------- OTP VERIFY ---------------- */

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      const res = await verifyOrderOtp(order.id, otp);

      if (!res?.success) {
        throw new Error(res?.message || "Invalid OTP");
      }

      alert("OTP verified successfully");

      setShowOtpModal(false);
      setOtp("");

      await onRefresh();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP"
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={`order-card ${className}`} onClick={onClick}>
      {/* HEADER */}
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

      {/* BODY */}
      <div className="order-body">
        <div className="student-info">
          <h3>{order.studentName}</h3>
          <p>{order.id}</p>
        </div>

        <div className="order-meta order-header">
          <span>
            📅{" "}
            {createdDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </span>
          <span>
            ⏰{" "}
            {createdDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>

        <div className="document-info">
          <p>{order.documentName}</p>
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          className="download-button"
          disabled={
            !order.isPaid ||
            order.status === "completed" ||
            downloading
          }
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

        {/* PRINT DETAILS */}
        <div className="print-details">
          <span>Paper: {order.paperType}</span>
          <span>Color: {order.colorMode}</span>
          <span>Finish: {order.finishType}</span>
          <span>Copies: {order.copies}</span>
          <span>
            {order.orientation === "landscape"
              ? "Landscape"
              : "Portrait"}
          </span>
        </div>

        {/* ACTION BUTTON (HIDDEN WHEN READY) */}
        {nextStatus &&
  order.isPaid &&
  order.status !== "printing" &&
  order.status !== "completed" && (
    <button
      className="action-button"
      disabled={updating}
      onClick={handleStatusUpdate}
    >
      {updating
        ? "Updating..."
        : getActionLabel(order.status)}
    </button>
  )}

      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowOtpModal(false)}
        >
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
                {verifyingOtp
                  ? "Verifying..."
                  : "Verify & Complete"}
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
