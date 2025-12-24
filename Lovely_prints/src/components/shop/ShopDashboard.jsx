import React, { useState , useEffect } from 'react';
import OrderList from './OrderList';
import './shop.css';
import PricingSettings from './PricingSettings';
import OrderPreview from './OrderPreview';
import { getShopOrders, updateOrderStatus } from "../../services/shopService";

export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);
 useEffect(() => {
  const fetchOrders = async () => {
    try {
      // setLoading(true);
      const res = await getShopOrders();
      setOrders(res.data);
    } catch (err) {
      // setError("Failed to load orders");
    } finally {
      // setLoading(false);
    }
  };

  fetchOrders();
}, []);




const handleStatusChange = async (orderId, newStatus) => {
  // optimistic UI update
  setOrders(prev =>
    prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    )
  );

  try {
    await updateOrderStatus(orderId, newStatus);
  } catch (err) {
    alert("Failed to update order status");
    // rollback by refetching
    const res = await getShopOrders();
    setOrders(res.data);
  }
};

  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="shop-dashboard">
      <header className="dashboard-header">
        <h1>Shop Dashboard</h1>
        <div className="shop-info">
          <span className="shop-number">Shop #7</span>
          <span className="shop-status open">Open</span>
        </div>
      </header>

    <div className="shop-tabs">
    <button
      className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
      onClick={() => setActiveTab('orders')}
    >
      Orders
    </button>

    <button
      className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
      onClick={() => setActiveTab('settings')}
    >
      Availability & Pricing
    </button>
    </div>
                {activeTab === 'orders' && (
          <>
            <OrderList
              orders={orders}
              onStatusChange={handleStatusChange}
              onSelectOrder={setSelectedOrder}
            />

            {selectedOrder && (
              <OrderPreview
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </>
        )}


        {activeTab === 'settings' && <PricingSettings />}

    </div>
  );
}