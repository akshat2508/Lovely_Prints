import "./admin.css";

const ShopOrders = ({ orders, loading, onOrderClick }) => {
  if (loading) {
    return (
      <div className="orders-section-A">
        <div className="orders-header-A">Recent Orders</div>
        <div className="orders-skeleton-A skeleton-A" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-section-A">
        <div className="orders-header-A">Recent Orders</div>
        <div className="orders-empty-A">No orders for this shop yet.</div>
      </div>
    );
  }

  return (
    <div className="orders-section-A">
      <div className="orders-header-A">Recent Orders</div>

      <div className="orders-table-wrapper-A">
        <table className="orders-table-A">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Pickup Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="orders-row-A"
                onClick={() => onOrderClick(order)}
              >
                <td className="order-no-A">{order.order_no}</td>
                <td>{order.users?.name}</td>
                <td className="order-amount-A">₹ {order.total_price}</td>
                <td>
                  <span className={`status-badge-A ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td className="order-date-A">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="order-date-A">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopOrders;
