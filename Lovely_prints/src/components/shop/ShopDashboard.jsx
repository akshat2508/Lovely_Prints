import React, { useState, useEffect } from "react";
import OrderList from "./OrderList";
import "./shop.css";
import PricingSettings from "./PricingSettings";
import OrderPreview from "./OrderPreview";
import { getShopOrders, updateOrderStatus } from "../../services/shopService";

export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [filterMode, setFilterMode] = useState("today");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [urgentFilter, setUrgentFilter] = useState("all");
  // "all" | "urgent" | "normal"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getShopOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isWithinDays = (date, days) =>
    (new Date() - date) / (1000 * 60 * 60 * 24) <= days;

  const filteredOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);

    if (filterMode === "today" && !isSameDay(createdAt, new Date()))
      return false;
    if (filterMode === "7days" && !isWithinDays(createdAt, 7)) return false;
    if (filterMode === "30days" && !isWithinDays(createdAt, 30)) return false;

    if (paymentFilter === "paid" && !order.isPaid) return false;
    if (paymentFilter === "unpaid" && order.isPaid) return false;
    if (urgentFilter === "urgent" && !order.isUrgent) return false;
    if (urgentFilter === "normal" && order.isUrgent) return false;

    return true;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    const prevOrders = orders;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert("Failed to update order status");
      setOrders(prevOrders);
    }
  };

  return (
    <div className="shop-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Shop Dashboard</h1>
        <div className="shop-info">
          <span className="shop-number">Shop #7</span>
          <span className="shop-status open">Open</span>
        </div>
      </header>

      {/* Tabs + Filters */}
      <div className="tabs-with-filters">
        {/* Tabs */}
        <div className="shop-tabs">
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Availability & Pricing
          </button>
        </div>

        {/* Filters */}
        {activeTab === "orders" && (
          <div className="order-filter-bar">
            <select
              className="filter-select"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Orders</option>
            </select>

            <select
              className="filter-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            {/* Urgency Filter */}
            <select
              className="filter-select"
              value={urgentFilter}
              onChange={(e) => setUrgentFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="urgent">Urgent Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "orders" && (
        <>
          <OrderList
            orders={filteredOrders}
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

      {activeTab === "settings" && <PricingSettings />}
    </div>
  );
}
