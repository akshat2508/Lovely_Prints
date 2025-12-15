import React from 'react';
import OrderDetails from './OrderDetails';

export default function OrderList({ orders, onStatusChange }) {
  if (orders.length === 0) {
    return (
      <div className="order-list-empty">
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      {orders.map(order => (
        <OrderDetails
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}