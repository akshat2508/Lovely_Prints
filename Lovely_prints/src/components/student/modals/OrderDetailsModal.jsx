import { useState } from "react"
import "./orderDetailsModal-H.css"
import { createPortal } from "react-dom";

const OrderDetailsModal = ({ order, onClose }) => {

  const doc = order.documents?.[0];

  return createPortal(
    <>
      <div className="modal-overlay-H">
        <div className="modal-card-H large-H">

          {/* HEADER */}
          <div className="modal-header-H">
            <h2>Order #{order.order_no}</h2>
            <span className="order-id-H">ID: {order.id}</span>
            <p className="muted-H">
              {order.shops?.shop_name} • {order.shops?.block}
            </p>
          </div>

          {/* DOCUMENT SECTION */}
          {doc && (
            <div className="section-H">
              <h4>Document</h4>
              <p className="overflow-H">{doc.file_name}</p>
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
                  <span className="urgent-badge-H">URGENT</span>
                )}
              </p>
            </div>
          )}

          {/* PAYMENT */}
          <div className="section-H payment-section-H">
            <h4>Payment</h4>
            <p>
              Status:{" "}
              <strong>{order.is_paid ? "Paid" : "Not Paid"}</strong>
            </p>
            <p>Total: ₹{order.total_price}</p>
          </div>

          {/* ACTIONS */}
          <div className="modal-actions-H">
            <button className="cancel-btn-H" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>,document.getElementById('modal-root')
  )
}

export default OrderDetailsModal