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
import EmptyShopOrders from "./EmptyShopOrders";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const SESSION_KEY = "shop_session_start";


const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isSameDay = (a, b) =>
  normalizeDate(a).getTime() === normalizeDate(b).getTime();

const isFutureDay = (d) => normalizeDate(d) > normalizeDate(new Date());


export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);

  /* filters */
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
  const [unseenOrderCount, setUnseenOrderCount] = useState(0);

  const [remainingTime, setRemainingTime] = useState(null);
  const notificationAudioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const now = new Date();

const generateTimeSlots = (openHour, closeHour) => {
  const slots = [];

  for (let hour = openHour; hour < closeHour; hour++) {
    const start = hour;
    const end = hour + 1;

    slots.push({
      label: `${String(start).padStart(2, "0")}:00 - ${String(end).padStart(2, "0")}:00`,
      start,
      end,
    });
  }

  return slots;
};

const TIME_SLOTS = React.useMemo(() => {
  if (!shop?.open_time || !shop?.close_time) return [];

  // Extract hour from "09:00:00"
  const openHour = parseInt(shop.open_time.split(":")[0], 10);
  const closeHour = parseInt(shop.close_time.split(":")[0], 10);
  return generateTimeSlots(openHour, closeHour);
}, [shop]);


const getCurrentSlotLabel = (now) => {
  const hour = now.getHours();
  const slot = TIME_SLOTS.find((s) => hour >= s.start && hour < s.end);
  return slot ? slot.label : null;
};
const getSlotForPickup = (date) => {
  const hour = date.getHours();
  return TIME_SLOTS.find((slot) => hour >= slot.start && hour < slot.end);
};

// ---------------------voice unlock----------------------------//
useEffect(() => {
  const unlockMedia = () => {
    // 🔊 unlock audio
    if (notificationAudioRef.current) {
      notificationAudioRef.current
        .play()
        .then(() => {
          notificationAudioRef.current.pause();
          notificationAudioRef.current.currentTime = 0;
        })
        .catch(() => {});
    }

    // 🗣️ unlock voice
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
      setVoiceEnabled(true);
    }

    window.removeEventListener("click", unlockMedia);
    window.removeEventListener("keydown", unlockMedia);
  };

  window.addEventListener("click", unlockMedia);
  window.addEventListener("keydown", unlockMedia);

  return () => {
    window.removeEventListener("click", unlockMedia);
    window.removeEventListener("keydown", unlockMedia);
  };
}, []);
useEffect(() => {
  console.log("🔊 Voice enabled:", voiceEnabled);
}, [voiceEnabled]);


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


  /* ================= FETCH SHOP ================= */

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await getMyShop();
        const shopData = res.data;

        setShop(shopData);

        // ✅ AUTO-OPEN SHOP ON DASHBOARD LOAD
        if (!shopData.is_active) {
          try {
            await setShopStatusManual(shopData.id, true);
            setShop((prev) => ({ ...prev, is_active: true }));
          } catch {
            console.error("Failed to auto-open shop");
          }
        }
      } catch {
        console.error("Failed to load shop info");
      }
    };

    fetchShop();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // every minute

    return () => clearInterval(timer);
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
  if (!voiceEnabled || document.hidden) return;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(
    new SpeechSynthesisUtterance("New order received")
  );
};

  const triggerNewOrderAlert = () => {
    setShowNewOrderToast(true);

    // 🔔 play sound
    if (voiceEnabled && notificationAudioRef.current) {
      notificationAudioRef.current.currentTime = 0;
      notificationAudioRef.current.play().catch(() => {});
    }

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
        setUnseenOrderCount((count) => count + freshOrders.length); // TAB Notification

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

  useEffect(() => {
    const baseTitle = "Lovely Prints";

    if (unseenOrderCount > 0) {
      document.title = `(${unseenOrderCount}) New Orders | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [unseenOrderCount]);

  const visibleOrders = orders.filter((order) => {
    /* ---------- PAYMENT FILTER ---------- */
    if (paymentFilter === "paid" && !order.isPaid) return false;
    if (paymentFilter === "unpaid" && order.isPaid) return false;

    /* ---------- URGENT FILTER ---------- */
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

  const today = new Date();

  /* ================= DISCARDED / OVERDUE ================= */
  const discardedOrders = visibleOrders.filter((order) => {
    if (!order.pickup_at) return false;

    const pickupDateTime = new Date(order.pickup_at);

    // ignore completed / cancelled
    if (["completed", "cancelled"].includes(order.status)) return false;

    return pickupDateTime < now;
  });
  /* ================= TODAY (slot-wise) ================= */
  
  const todaysOrdersBySlot = {};
  TIME_SLOTS.forEach((s) => {
    todaysOrdersBySlot[s.label] = [];
  });

  /* ================= SCHEDULED (date → slot-wise) ================= */
  const scheduledOrdersByDateAndSlot = {};

  visibleOrders.forEach((order) => {
    if (!order.pickup_at) return;

    const pickupDate = new Date(order.pickup_at);
    // ⛔ skip overdue orders
    if (
      pickupDate < now &&
      !["completed", "cancelled"].includes(order.status)
    ) {
      return;
    }
    const slot = getSlotForPickup(pickupDate);
    if (!slot) return;

    // TODAY
    if (isSameDay(pickupDate, today)) {
      todaysOrdersBySlot[slot.label].push(order);
    }

    // FUTURE
    else if (isFutureDay(pickupDate)) {
      const dateKey = pickupDate.toDateString();

      if (!scheduledOrdersByDateAndSlot[dateKey]) {
        scheduledOrdersByDateAndSlot[dateKey] = {};
        TIME_SLOTS.forEach((s) => {
          scheduledOrdersByDateAndSlot[dateKey][s.label] = [];
        });
      }

      scheduledOrdersByDateAndSlot[dateKey][slot.label].push(order);
    }
  });
  const currentSlotLabel = getCurrentSlotLabel(currentTime);

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
            setUnseenOrderCount(0); // 🔔 reset title badge
          }
        }}
        hasNewOrders={hasNewOrders}
        hasUrgentOrders={hasUrgentOrders}
        sessionTimeLeft={
          remainingTime !== null ? formatTime(remainingTime) : null
        }
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
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.label}
              className={`time-slot-wrapper ${
                currentSlotLabel === slot.label ? "active-slot" : ""
              }`}
            >
              <div className="slot-label">{slot.label}</div>

              {todaysOrdersBySlot[slot.label].length === 0 ? (
                <div className="empty-slot-message">
                  No orders in this time slot
                </div>
              ) : (
                <OrderList
                  orders={todaysOrdersBySlot[slot.label]}
                  onStatusChange={handleStatusChange}
                  onSelectOrder={setSelectedOrder}
                  onRefresh={fetchOrders}
                />
              )}
            </div>
          ))}

          {selectedOrder && (
            <OrderPreview
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </>
      )}

      {activeTab === "scheduled" && (
        <>
          {Object.keys(scheduledOrdersByDateAndSlot).length === 0 && (
            // <EmptyShopOrders />
            <EmptyShopOrders/>
          )}

          {Object.entries(scheduledOrdersByDateAndSlot).map(([date, slots]) => (
            <div key={date} className="scheduled-day">
              <h3 className="date-header">{date}</h3>

              {TIME_SLOTS.map((slot) => (
                <div key={slot.label} className="time-slot-wrapper">
                  <div className="slot-label">{slot.label}</div>

                  {slots[slot.label].length === 0 ? (
                    <div className="empty-slot-message">
                      No orders in this time slot
                    </div>
                  ) : (
                    <OrderList
                      orders={slots[slot.label]}
                      onStatusChange={handleStatusChange}
                      onSelectOrder={setSelectedOrder}
                      onRefresh={fetchOrders}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

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
      <audio
        ref={notificationAudioRef}
        src="/notification.mp3"
        preload="auto"
      />
      {activeTab === "discarded" && (
        <>
          {discardedOrders.length === 0 ? (
            <div className="empty-slot-message">No discarded orders</div>
          ) : (
            <OrderList
              orders={discardedOrders}
              onStatusChange={handleStatusChange}
              onSelectOrder={setSelectedOrder}
              onRefresh={fetchOrders}
            />
          )}

          {selectedOrder && (
            <OrderPreview
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
