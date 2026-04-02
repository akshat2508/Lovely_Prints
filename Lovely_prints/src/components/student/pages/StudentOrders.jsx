import { useEffect, useState } from "react";
import { getStudentOrders } from "../../../services/studentService";
import TrackOrderModal from "../modals/TrackOrderModal";
import OrderCard from "../components/OrderCard";
import OrdersSkeleton from "../skeletons/OrdersSkeleton";
import EmptyOrders from "../skeletons/EmptyOrders";
import "../dashboard.css";
import "./studentOrders.css"
import { supabase } from "../../../services/supabase";
const STATUS_FLOW = ["pending", "confirmed", "printing", "ready", "completed"];

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  ready: "Ready for Pickup",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const StudentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getStudentOrders();
      if (res?.success) setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  supabase.realtime.setAuth(localStorage.getItem("access_token"));

  const channel = supabase
    .channel("student-orders-live")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        const updated = payload.new;

        setOrders((prev) =>
          prev.map((order) =>
            order.id === updated.id ? { ...order, ...updated } : order
          )
        );

        // ALSO update modal if open
        setSelectedOrder((prev) =>
          prev?.id === updated.id ? { ...prev, ...updated } : prev
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  useEffect(() => {
    fetchOrders();
  }, []);
  const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isWithinDays = (date, days) =>
  (new Date() - date) / (1000 * 60 * 60 * 24) <= days;


  return (
    <div className="dashboard">
      <div className="header-C">
  <div className="header-left-C">
    <h1 className="header-title-C">My Orders</h1>
    <p className="header-subtitle-C">
      Track, manage, and review your print orders
    </p>
    <div className="orders-filter-row-C">
  <select
    className="orders-filter-select-C"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
  >
    <option value="all">All Orders</option>
    <option value="today">Today</option>
    <option value="7days">Last 7 Days</option>
    <option value="30days">Last 30 Days</option>
  </select>
</div>

  </div>
</div>

      {loading && <OrdersSkeleton count={6} />}

     <main className="orders-wrapper-C">
        {!loading && orders.length === 0 && <EmptyOrders />}

 {orders
  .filter((order) => {
    if (dateFilter === "all") return true;

    const createdAt = new Date(order.created_at);

    if (dateFilter === "today") {
      return isSameDay(createdAt, new Date());
    }

    if (dateFilter === "7days") {
      return isWithinDays(createdAt, 7);
    }

    if (dateFilter === "30days") {
      return isWithinDays(createdAt, 30);
    }

    return true;
  })
  .map((order) => (
    <OrderCard key={order.id} order={order} />
  ))}

</main>


      {selectedOrder && (
        <TrackOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default StudentOrders;
