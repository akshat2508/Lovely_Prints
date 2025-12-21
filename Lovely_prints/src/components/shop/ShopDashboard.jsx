import React, { useState } from 'react';
import OrderList from './OrderList';
import './shop.css';
import PricingSettings from './PricingSettings';
import OrderPreview from './OrderPreview';


export default function ShopDashboard() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      studentName: 'Rahul Sharma',
      studentId: 'CS2021001',
      documentName: 'Assignment_3.pdf',
      documentUrl: '/test-document.txt',
      paperType: 'A4',
      size: 'A4',
      copies: 5,
      isExpress: false,
      eta: '2:00 PM',
      status: 'pending'
    },
    {
      id: 'ORD002',
      studentName: 'Priya Patel',
      studentId: 'EC2021045',
      documentName: 'Project_Report.pdf',
      paperType: 'A4',
      size: 'A4',
      copies: 20,
      isExpress: true,
      eta: '12:30 PM',
      status: 'printing'
    },
    {
      id: 'ORD003',
      studentName: 'Amit Kumar',
      studentId: 'ME2020123',
      documentName: 'Lecture_Notes.pdf',
      paperType: 'A4',
      size: 'A4',
      copies: 10,
      isExpress: false,
      eta: '3:30 PM',
      status: 'ready'
    },
    {
      id: 'ORD004',
      studentName: 'Sneha Reddy',
      studentId: 'IT2021078',
      documentName: 'Resume.pdf',
      paperType: 'A4',
      size: 'A4',
      copies: 15,
      isExpress: true,
      eta: '1:00 PM',
      status: 'confirmed'
    },
    {
      id: 'ORD005',
      studentName: 'Vikram Singh',
      studentId: 'EE2020056',
      documentName: 'Thesis_Draft.pdf',
      paperType: 'A4',
      size: 'A4',
      copies: 3,
      isExpress: false,
      eta: '4:00 PM',
      status: 'completed'
    }
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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