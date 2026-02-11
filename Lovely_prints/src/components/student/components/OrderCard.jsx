import { useState } from "react";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import TrackOrderModal from "../modals/TrackOrderModal";
import "./orderCard-D.css";

const STATUS_COLORS = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  printing: "status-printing",
  ready: "status-ready",
  completed: "status-completed",
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTrackDetails, setShowTrackDetails] = useState(false);

  const doc = order.documents?.[0];

  /* ================= DATE HELPERS ================= */

  const now = new Date();

  const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  /* ================= STATE DERIVED ================= */

  const pickupAt = parseDate(order.pickup_at);

  const isCompleted = order.status === "completed";

  const isExpired =
    pickupAt &&
    now > pickupAt &&
    !isCompleted;

  const isReady =
    order.status === "ready" && !isExpired;

  /* ================= RENDER ================= */

  return (
    <>
      {/* ================= ORDER CARD ================= */}
      <div
        className={`order-card-D
          ${isCompleted ? "order-completed-D" : ""}
          ${isReady ? "order-ready-D" : ""}
          ${isExpired ? "order-expired-D" : ""}
        `}
      >
        {/* ================= HEADER ================= */}
        <div className="order-header-D">
          <div className="order-header-left-D">
            <h3>Order #{order.order_no}</h3>
            <p className="order-shop-D">
              {order.shops?.shop_name} • {order.shops?.block}
            </p>
          </div>

          <div className="order-meta-D">
            <span className={`status-badge-D ${STATUS_COLORS[order.status]}`}>
              {order.status.toUpperCase()}
            </span>
            <span className="order-price-D">₹{order.total_price}</span>
          </div>
        </div>

        {/* ================= QUICK SUMMARY ================= */}
        {doc && (
          <p className="order-summary-D">
            {doc.file_name} • {doc.page_count} pages × {doc.copies}
          </p>
        )}

        {/* ================= EXPIRED WARNING ================= */}
        {isExpired && (
          <div className="order-expired-warning-D">
            ⚠ Pickup expired. This order was not collected before the pickup
            time.
          </div>
        )}

        {/* ================= EXPANDED DETAILS ================= */}
        {expanded && doc && (
          <div className="order-expand-D">
            <p>
              {doc.paper_types?.name} • {doc.color_modes?.name} •{" "}
              {doc.finish_types?.name}
              {order.is_urgent && (
                <span className="urgent-badge-D">URGENT</span>
              )}
            </p>

            <p className="order-btn-secondary-D">ID: {order.id}</p>

            <p className="order-btn-secondary-D">
              Placed At : {formatDate(order.created_at)}
            </p>

            {order.pickup_at && (
              <p className="order-btn-secondary-D">
                Pickup At : {formatDate(order.pickup_at)}
              </p>
            )}

            {/* ================= OTP (READY & NOT EXPIRED ONLY) ================= */}
            {isReady &&
              order.delivery_otp &&
              !order.otp_verified && (
                <div className="otp-preview-D">
                  <span className="otp-preview-label">Pickup Code</span>
                  <span className="otp-preview-code">
                    {order.delivery_otp}
                  </span>
                </div>
              )}

            <button
              className="order-btn-secondary-B-D"
              onClick={() => setShowDetails(true)}
            >
              Open full details →
            </button>
          </div>
        )}

        {/* ================= ACTIONS ================= */}
        <div className="order-actions-D">
          <button
            className="order-btn-secondary-D"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : "View details"}
          </button>

          {/* Track allowed ONLY if not completed & not expired */}
          {!isCompleted && !isExpired && (
            <button
              className="order-btn-primary-D"
              onClick={() => setShowTrackDetails(true)}
            >
              Track Order
            </button>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {showDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showTrackDetails && (
        <TrackOrderModal
          order={order}
          onClose={() => setShowTrackDetails(false)}
        />
      )}
    </>
  );
};

export default OrderCard;
