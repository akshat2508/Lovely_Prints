import React from 'react';
import OrderDetails from './OrderDetails';
import EmptyShopOrders from './EmptyShopOrders';

export default function OrderList({ orders, onStatusChange, onSelectOrder , onRefresh}) {
  if (orders.length === 0) {
    return (
     
        <EmptyShopOrders/>

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
              onRefresh={onRefresh}
              onClick={() => onSelectOrder(order)}
              className={order.isUrgent ? "urgent-order" : ""}
            />
          ))}
    </div>
  );
}