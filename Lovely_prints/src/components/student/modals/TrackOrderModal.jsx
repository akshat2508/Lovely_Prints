import "./modals.css"

const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"]

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
}

const TrackOrderModal = ({ order, onClose }) => {
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

        {/* OTP Section */}
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

        {/* Timeline */}
        <div className="timeline timeline-pro">
          {STATUS_FLOW.map((step) => {
            const stepIndex = STATUS_FLOW.indexOf(step)
            const orderIndex = STATUS_FLOW.indexOf(order.status)

            return (
              <div
                key={step}
                className={`timeline-item ${
                  stepIndex < orderIndex
                    ? "completed"
                    : stepIndex === orderIndex
                    ? "active"
                    : ""
                }`}
              >
                <span className="timeline-dot"></span>
                <span className="timeline-text">
                  {STATUS_LABELS[step]}
                </span>
              </div>
            )
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
  )
}

export default TrackOrderModal
