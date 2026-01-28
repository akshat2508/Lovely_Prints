import React, { useState, useEffect, useRef } from "react";
import OrderList from "./OrderList";
import "./shop.css";
import PricingSettings from "./PricingSettings";
import OrderPreview from "./OrderPreview";
import {
  getShopOrders,
  updateOrderStatus,
  getMyShop,
  setShopStatusManual,
} from "../../services/shopService";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import ShopAnalytics from "./analytics/ShopAnalytics";
import ShopNavbar from "./ShopNavbar";
const SESSION_DURATION = 60 *60 *1000; // 1 hour
const SESSION_KEY = "shop_session_start";

export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);

  /* filters */
  const [filterMode, setFilterMode] = useState("today");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [urgentFilter, setUrgentFilter] = useState("all");

  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [shop, setShop] = useState(null);
  const [shopStatusLoading, setShopStatusLoading] = useState(false);

  const prevOrderIdsRef = useRef(new Set());
  const [showNewOrderToast, setShowNewOrderToast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [hasUrgentOrders, setHasUrgentOrders] = useState(false);
  const sessionTimerRef = useRef(null);

const [remainingTime, setRemainingTime] = useState(null);

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const navigate = useNavigate();
  //SAFETY NET
  useEffect(() => {
  if (!localStorage.getItem("access_token")) {
    navigate("/login");
  }
}, []);

  /* ================= VOICE UNLOCK ================= */

  useEffect(() => {
    const unlockVoice = () => {
      setVoiceEnabled(true);
      window.removeEventListener("click", unlockVoice);
      window.removeEventListener("keydown", unlockVoice);
    };

    window.addEventListener("click", unlockVoice);
    window.addEventListener("keydown", unlockVoice);

    return () => {
      window.removeEventListener("click", unlockVoice);
      window.removeEventListener("keydown", unlockVoice);
    };
  }, []);

  /* ================= FETCH SHOP ================= */

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await getMyShop();
        setShop(res.data);
      } catch {
        console.error("Failed to load shop info");
      }
    };

    fetchShop();
  }, []);

  /* ================= MANUAL SHOP TOGGLE ================= */

  const handleManualToggle = async () => {
    if (!shop || shopStatusLoading) return;

    const nextStatus = !shop.is_active;

    setShop((prev) => ({ ...prev, is_active: nextStatus }));
    setShopStatusLoading(true);

    try {
      await setShopStatusManual(shop.id, nextStatus);
    } catch {
      setShop((prev) => ({ ...prev, is_active: !nextStatus }));
      alert("Failed to update shop status");
    } finally {
      setShopStatusLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      if (shop?.id && shop?.is_active) {
        await setShopStatusManual(shop.id, false);
      }

      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /* ================= VOICE ALERT ================= */

  const speakNewOrder = () => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance("New order received");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const triggerNewOrderAlert = () => {
    setShowNewOrderToast(true);
    speakNewOrder();
    setTimeout(() => setShowNewOrderToast(false), 4000);
  };

  /* ================= ORDERS ================= */

  const fetchOrders = async () => {
    try {
      const res = await getShopOrders();
      const newOrders = res.data || [];

      const prevIds = prevOrderIdsRef.current;
      const newIds = new Set(newOrders.map((o) => o.id));

      // 🆕 detect truly new orders
      const freshOrders = newOrders.filter((o) => !prevIds.has(o.id));

      if (prevIds.size > 0 && freshOrders.length > 0) {
        setHasNewOrders(true);

        // 🚨 urgent detection
        if (freshOrders.some((o) => o.isUrgent)) {
          setHasUrgentOrders(true);
        }

        triggerNewOrderAlert(); // your existing voice + toast
      }

      prevOrderIdsRef.current = newIds;
      setOrders(newOrders);
    } catch {
      console.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "orders") fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  /* ================= FILTERING ================= */

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isWithinDays = (d, days) =>
    (new Date() - d) / (1000 * 60 * 60 * 24) <= days;

  const filteredOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);

    /* ---------- DATE FILTERS ---------- */
    if (filterMode === "today" && !isSameDay(createdAt, new Date()))
      return false;
    if (filterMode === "7days" && !isWithinDays(createdAt, 7)) return false;
    if (filterMode === "30days" && !isWithinDays(createdAt, 30)) return false;

    /* ---------- PAYMENT FILTERS ---------- */
    if (paymentFilter === "paid" && !order.isPaid) return false;
    if (paymentFilter === "unpaid" && order.isPaid) return false;

    /* ---------- URGENT FILTERS ---------- */
    if (urgentFilter === "urgent" && !order.isUrgent) return false;
    if (urgentFilter === "normal" && order.isUrgent) return false;

    /* ---------- SEARCH FILTER ---------- */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      const orderId = String(order.id || "").toLowerCase();
      const orderNo = String(order.orderNo || "").toLowerCase();

      if (!orderId.includes(q) && !orderNo.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    const prev = orders;

    setOrders((list) =>
      list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
      alert("Failed to update order");
      setOrders(prev);
    }
  };

  const forceSessionExpiry = async () => {
  try {
    alert("Session expired. Please login again.");

    // close shop safely
    if (shop?.id && shop?.is_active) {
      await setShopStatusManual(shop.id, false);
    }
  } catch (e) {
    console.error("Error while expiring session", e);
  } finally {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("access_token");
    navigate("/login");
  }
};
useEffect(() => {
  const now = Date.now();

  let sessionStart = localStorage.getItem(SESSION_KEY);

  // first time dashboard loads
  if (!sessionStart) {
    sessionStart = now;
    localStorage.setItem(SESSION_KEY, sessionStart);
  }

  const elapsed = now - Number(sessionStart);
  const remaining = SESSION_DURATION - elapsed;

  // session already expired
  if (remaining <= 0) {
    forceSessionExpiry();
    return;
  }

  // schedule auto logout
  sessionTimerRef.current = setTimeout(() => {
    forceSessionExpiry();
  }, remaining);

  return () => {
    clearTimeout(sessionTimerRef.current);
  };
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    const start = localStorage.getItem(SESSION_KEY);
    if (!start) return;

    const elapsed = Date.now() - Number(start);
    const left = SESSION_DURATION - elapsed;

    setRemainingTime(left > 0 ? left : 0);
  }, 1000);

  return () => clearInterval(interval);
}, []);



  /* ================= UI ================= */

  return (
    <div className="shop-dashboard">
      <ShopNavbar
        shop={shop}
        isUpdating={shopStatusLoading}
        onToggleShop={handleManualToggle}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);

          // 🔔 clear notification ONLY when orders tab clicked
          if (tab === "orders") {
            setHasNewOrders(false);
            setHasUrgentOrders(false);
          }
        }}
        hasNewOrders={hasNewOrders}
        hasUrgentOrders={hasUrgentOrders}
          sessionTimeLeft={remainingTime !== null ? formatTime(remainingTime) : null}

      />

      {showNewOrderToast && (
        <div className="new-order-toast">🖨️ New order received</div>
      )}

      {/* Tabs + Filters */}
      <div className="tabs-with-filters">
        {activeTab === "orders" && (
          <div className="order-filter-bar">
            {/* Left: Search */}
            <div className="order-filter-left">
              <input
                type="text"
                className="order-search-input"
                placeholder="Search by Order ID or Order No"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right: Filters */}
            <div className="order-filter-right">
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
            onRefresh={fetchOrders}
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
      {activeTab === "analytics" && <ShopAnalytics orders={orders} />}
    </div>
  );
}
