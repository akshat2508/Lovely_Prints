import "./modals.css";
import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Printer,
  PackageCheck,
  Truck,
} from "lucide-react";
import { getStudentOrders } from "../../../services/studentService";

const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
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
  const [liveOrder, setLiveOrder] = useState(order);

  // keep in sync when parent changes
  useEffect(() => {
    setLiveOrder(order);
  }, [order]);

  // 🔁 polling (SAFE)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getStudentOrders();
        if (res?.success) {
          const updated = res.data.find(o => o.id === liveOrder.id);
          if (updated && updated.updated_at !== liveOrder.updated_at) {
            setLiveOrder(updated);
          }
        }
      } catch (e) {
        console.error("Order polling failed", e);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [liveOrder.id, liveOrder.updated_at]);

  const currentIndex = STATUS_FLOW.indexOf(liveOrder.status);

  return (
    <div className="modal-overlay">
      <div className="modal-card large">
        {/* Header */}
        <div className="track-header">
          <h2>Track Order #{liveOrder.order_no}</h2>
          <p className="muted">
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
            ✅ Order has been successfully delivered
          </div>
        )}

        {/* ================= TIMELINE ================= */}
        <div className="timeline-pro">
          {STATUS_FLOW.map((step, index) => {
            const Icon = STATUS_ICONS[step];
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;

            let timestamp = null;
            if (index === 0) timestamp = formatTime(liveOrder.created_at);
            if (isActive) timestamp = formatTime(liveOrder.updated_at);

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

                {/* Timestamp */}
                <div className="timeline-time-col">
                  {timestamp && (
                    <span className="timeline-time">{timestamp}</span>
                  )}
                </div>

                {/* Stage */}
                <div className="timeline-stage-col">
                  <span className="timeline-text">
                    {STATUS_LABELS[step]}
                  </span>
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
