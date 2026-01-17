import { useState } from "react"
import OrderDetailsModal from "../modals/OrderDetailsModal"
import "./orderCard-D.css"

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
      <div className="order-card-D">
        {/* ===== HEADER ===== */}
        <div className="order-header-D">
          <div className="order-header-left-D">
            <h3>Order #{order.order_no}</h3>
            <p className="order-shop-D">
              {order.shops?.shop_name} • {order.shops?.block}
            </p>
          </div>

          <div className="order-meta-D">
            <span
              className={`status-badge-D ${STATUS_COLORS[order.status]}`}
            >
              {order.status.toUpperCase()}
            </span>
            <span className="order-price-D">₹{order.total_price}</span>
          </div>
        </div>

        {/* ===== QUICK SUMMARY ===== */}
        {doc && (
          <p className="order-summary-D">
            {doc.file_name} • {doc.page_count} pages × {doc.copies}
          </p>
        )}

        {/* ===== INLINE EXPAND ===== */}
        {expanded && doc && (
          <div className="order-expand-D">
            <p>
              {doc.paper_types?.name} • {doc.color_modes?.name} •{" "}
              {doc.finish_types?.name}
              {order.is_urgent && (
                <span className="urgent-badge-D">URGENT</span>
              )}
            </p>
              <p className="id-D">ID: {order.id}</p>
            <button
              className="order-btn-secondary-D"
              onClick={() => setShowDetails(true)}
            >
              Open full details →
            </button>
          </div>
        )}

        {/* ===== ACTIONS ===== */}
        <div className="order-actions-D">
          <button
            className="order-btn-secondary-D"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : "View details"}
          </button>

          {order.status !== "completed" && (
            <button
              className="order-btn-primary-D"
              onClick={() => setShowDetails(true)}
            >
              Track Order
            </button>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
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
