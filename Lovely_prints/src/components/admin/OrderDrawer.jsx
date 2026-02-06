import "./admin.css";
import "./admin-theme.css";

const OrderDrawer = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="order-drawer-backdrop" onClick={onClose}>
      <div
        className="order-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h3>Order #{order.order_no}</h3>
          <button className="drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-section">
          <div><strong>Student:</strong> {order.users?.name}</div>
          <div><strong>Status:</strong> {order.status}</div>
          <div><strong>Total:</strong> ₹ {order.total_price}</div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </div>
        </div>

        <div className="drawer-section">
          <h4>Documents</h4>

          {order.documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="doc-name">{doc.file_name}</div>

              <div className="doc-meta">
                <span>{doc.page_count} pages</span>
                <span>{doc.copies} copies</span>
              </div>

              <div className="doc-meta">
                <span>{doc.paper_types?.name}</span>
                <span>{doc.color_modes?.name}</span>
                <span>{doc.finish_types?.name}</span>
              </div>

              <div className="doc-price">
                ₹ {doc.total_price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDrawer;
