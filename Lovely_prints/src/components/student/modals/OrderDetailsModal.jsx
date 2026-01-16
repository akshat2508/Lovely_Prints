import TrackOrderModal from "./TrackOrderModal"
import { useState } from "react"
// import "../dashboard.css"
import "./modals.css"

const OrderDetailsModal = ({ order, onClose }) => {
  const [showTracking, setShowTracking] = useState(false)
  const doc = order.documents?.[0]

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card large">
          <h2>Order #{order.order_no}</h2>

          <p className="muted">
            {order.shops?.shop_name} • {order.shops?.block}
          </p>

      

          {doc && (
            <>
              <h4>Document</h4>
              <p>{doc.file_name}</p>
              <p>
                {doc.page_count} pages × {doc.copies}
              </p>

              <h4>Print Configuration</h4>
              <p>
                {doc.paper_types?.name} • {doc.color_modes?.name} •{" "}
                {doc.finish_types?.name}
              </p>

              <p>
                Orientation: {order.orientation}
                {order.is_urgent && (
                  <span className="urgent-badge">URGENT</span>
                )}
              </p>
            </>
          )}

          <hr />

          <h4>Payment</h4>
          <p>
            Status:{" "}
            <strong>{order.is_paid ? "Paid" : "Not Paid"}</strong>
          </p>
          <p>Total: ₹{order.total_price}</p>

          <div className="modal-actions">
            {order.status !== "completed" && (
              <button
                className="primary-btn"
                onClick={() => setShowTracking(true)}
              >
                Track Order
              </button>
            )}
            <button className="cancel-btn1" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {showTracking && (
        <TrackOrderModal
          order={order}
          onClose={() => setShowTracking(false)}
        />
      )}
    </>
  )
}

export default OrderDetailsModal
