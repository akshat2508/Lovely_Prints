import "./trackOrderModal-G.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"
import {
  Clock,
  CheckCircle2,
  Printer,
  PackageCheck,
  Truck,
} from "lucide-react";
import { getStudentOrders } from "../../../services/studentService";
import {supabase} from "../../../services/supabase"
const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Picked Up",
};

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  printing: Printer,
  ready: PackageCheck,
  completed: Truck,
};

const formatTime = (ts) => {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
};

const TrackOrderModal = ({ order, onClose }) => {
  // const [liveOrder, setLiveOrder] = useState(order);
  const liveOrder  = order;
  const currentIndex = STATUS_FLOW.indexOf(liveOrder.status);

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-card large">
        {/* Header */}
        <div className="track-header">
          <h2>Track Order #{liveOrder.order_no}</h2>
          <p id="muted-H">
            {liveOrder.shops?.shop_name} • {liveOrder.shops?.block}
          </p>
        </div>

        {/* OTP */}
        {liveOrder.status === "ready" &&
          !liveOrder.otp_verified &&
          liveOrder.delivery_otp && (
            <div className="otp-box-pro">
              <p className="otp-label">Pickup Code</p>
              <p className="otp-code">{liveOrder.delivery_otp}</p>
              <p className="otp-hint">
                Show this code at the shop counter to collect your prints
              </p>
            </div>
          )}

        {liveOrder.otp_verified && (
          <div className="otp-success">
             Order has been successfully picked Up
          </div>
        )}

        {/* ================= TIMELINE ================= */}
        <div className="timeline-horizontal">
          {STATUS_FLOW.map((step, index) => {
            const Icon = STATUS_ICONS[step];
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;

            let timestamp = null;
            if (index === 0) timestamp = formatTime(liveOrder.created_at);
            if (isActive) timestamp = formatTime(liveOrder.updated_at);

            return (
              <div key={step} className="timeline-step">
                <div
                  className={`timeline-circle ${
                    isDone ? "done" : isActive ? "active" : ""
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="timeline-label">{STATUS_LABELS[step]}</div>

                {timestamp && (
                  <div className="timeline-time-small">{timestamp}</div>
                )}

                {index !== STATUS_FLOW.length - 1 && (
                  <div
                    className={`timeline-connector ${isDone ? "done" : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="cancel-btn1" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,document.getElementById("modal-root")
  );
};

export default TrackOrderModal;
