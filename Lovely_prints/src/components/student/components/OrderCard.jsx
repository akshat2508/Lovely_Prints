import { useState } from "react"
import OrderDetailsModal from "../modals/OrderDetailsModal"

const STATUS_COLORS = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  printing: "status-printing",
  ready: "status-ready",
  completed: "status-completed",
}

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const doc = order.documents?.[0]

  return (
    <>
      <div className="order-card-pro">
        {/* Header */}
        <div className="order-card-header">
          <div>
            <h3>Order #{order.order_no}</h3>
            <p className="muted">
              {order.shops?.shop_name} • {order.shops?.block}
            </p>
          </div>

          <div className="order-meta-right">
            <span className={`status-badge-A ${STATUS_COLORS[order.status]}`}>
              {order.status.toUpperCase()}
            </span>
            <strong>₹{order.total_price}</strong>
          </div>
        </div>

        {/* Quick info */}
        {doc && (
          <p className="order-doc-summary">
            {doc.file_name} • {doc.page_count} pages × {doc.copies}
          </p>
        )}

        {/* Expand */}
        {expanded && doc && (
          <div className="order-expand">
            <p>
              {doc.paper_types?.name} • {doc.color_modes?.name} •{" "}
              {doc.finish_types?.name}
              {order.is_urgent && <span className="urgent-badge">URGENT</span>}
            </p>

            <button
              className="link-btn"
              onClick={() => setShowDetails(true)}
            >
              Open full details →
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="order-actions">
          <button
            className="secondary-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : "View details"}
          </button>

          {order.status !== "completed" && (
            <button
              className="primary-btn"
              onClick={() => setShowDetails(true)}
            >
              Track Order
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
}

export default OrderCard
