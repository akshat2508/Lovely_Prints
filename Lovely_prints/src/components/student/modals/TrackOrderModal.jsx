import "./modals.css";
import {
  Clock,
  CheckCircle2,
  Printer,
  PackageCheck,
  Truck,
} from "lucide-react";

const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
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

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  printing: Printer,
  ready: PackageCheck,
  completed: Truck,
};

const TrackOrderModal = ({ order, onClose }) => {
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const statusTimeMap = {};
  order.status_history?.forEach((item) => {
    statusTimeMap[item.status] = item.updated_at;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card large">
        {/* Header */}
        <div className="track-header">
          <h2>Track Order #{order.order_no}</h2>
          <p className="muted">
            {order.shops?.shop_name} • {order.shops?.block}
          </p>
        </div>

        {/* OTP */}
        {order.status === "ready" &&
          !order.otp_verified &&
          order.delivery_otp && (
            <div className="otp-box-pro">
              <p className="otp-label">Pickup Code</p>
              <p className="otp-code">{order.delivery_otp}</p>
              <p className="otp-hint">
                Show this code at the shop counter to collect your prints
              </p>
            </div>
          )}

        {order.otp_verified && (
          <div className="otp-success">
            ✅ Order has been successfully delivered
          </div>
        )}

        {/* ================= CUSTOM TIMELINE ================= */}
        {/* ================= CUSTOM TIMELINE ================= */}
        <div className="timeline-pro">
          {STATUS_FLOW.map((step, index) => {
            const Icon = STATUS_ICONS[step];
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;

            // Timestamp logic
            let timestamp = null;
            if (index === 0) {
              timestamp = formatTime(order.created_at);
            }
            if (isActive) {
              timestamp = formatTime(order.updated_at);
            }

            return (
              <div
                key={step}
                className={`timeline-row ${
                  isDone ? "done" : isActive ? "active" : ""
                }`}
              >
                {/* Rail */}
                <div className="timeline-rail">
                  <div className="timeline-dot">
                    <Icon size={16} />
                  </div>

                  {index !== STATUS_FLOW.length - 1 && (
                    <div className="timeline-line" />
                  )}
                </div>

                {/* Timestamp (right of icon) */}
                <div className="timeline-time-col">
                  {timestamp && (
                    <span className="timeline-time">{timestamp}</span>
                  )}
                </div>

                {/* Stage label (extreme right) */}
                <div className="timeline-stage-col">
                  <span className="timeline-text">{STATUS_LABELS[step]}</span>
                </div>
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
    </div>
  );
};

export default TrackOrderModal;
