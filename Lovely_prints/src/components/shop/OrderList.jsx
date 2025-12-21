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

  const activeOrders = orders.filter(
  order => !['completed', 'cancelled'].includes(order.status)
  );

  const completedOrders = orders.filter(
  order => ['completed', 'cancelled'].includes(order.status)
  );

  const sortedOrders = [...activeOrders, ...completedOrders];


  return (
    <div className="order-list">
      {sortedOrders.map(order => (
        <OrderDetails
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}