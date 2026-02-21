import "./admin.css";

const OrderDrawer = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="drawer-overlay-A" onClick={onClose}>
      <div
        className="drawer-panel-A"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-top-A">
          <div>
            <div className="drawer-label-A">Order Details</div>
            <h2 className="drawer-title-A">
              #{order.order_no}
            </h2>
          </div>

          <button className="drawer-close-btn-A" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="drawer-summary-A">
          <div className="summary-item-A">
            <div className="summary-label-A">Student</div>
            <div className="summary-value-A">
              {order.users?.name}
            </div>
          </div>

          <div className="summary-item-A">
            <div className="summary-label-A">Status</div>
            <span className={`status-badge-A ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="summary-item-A">
            <div className="summary-label-A">Total</div>
            <div className="summary-value-A total-highlight">
              ₹ {order.total_price}
            </div>
          </div>

          <div className="summary-item-A">
            <div className="summary-label-A">Date</div>
            <div className="summary-value-A">
             {order.pickup_at
                    ? new Date(
                        order.created_at.replace(" ", "T"),
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
            </div>
          </div>
          <div className="summary-item-A">
            <div className="summary-label-A">Date</div>
            <div className="summary-value-A">
              {order.pickup_at
                    ? new Date(
                        order.pickup_at.replace(" ", "T"),
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="drawer-divider-A" />

        {/* Documents */}
        <div className="drawer-section-A">
          <div className="drawer-section-title-A">
            Documents
          </div>

          {order.documents.map((doc) => (
            <div key={doc.id} className="drawer-doc-card-A">
              <div className="doc-header-A">
                <div className="doc-title-A">
                  {doc.file_name}
                </div>
              
              </div>

              <div className="doc-details-A">
                <span>{doc.page_count} pages</span>
                <span>{doc.copies} copies</span>
                <span>{doc.paper_types?.name}</span>
                <span>{doc.color_modes?.name}</span>
                <span>{doc.finish_types?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;