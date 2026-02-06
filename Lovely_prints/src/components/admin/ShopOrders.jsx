import "./admin.css";
import "./admin-theme.css";

const ShopOrders = ({ orders, loading, onOrderClick }) => {
  if (loading) {
    return <div className="skeleton table-skeleton" />;
  }

  if (!orders || orders.length === 0) {
    return <p>No orders for this shop</p>;
  }

  return (
    <div className="shop-orders">
      <h3>Recent Orders</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Student</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="order-row"
              onClick={() => onOrderClick(order)}
            >
              <td>{order.order_no}</td>
              <td>{order.users?.name}</td>
              <td>₹ {order.total_price}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopOrders;
