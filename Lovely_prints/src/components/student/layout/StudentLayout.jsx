import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import StudentBottomNav from "./StudentBottomNav";
import { logoutUser } from "../../../services/authService";
import "./studentLayout.css";
import StudentSidebar from "./StudentSidebar";
import StudentRightRail from "./StudentRightRail";
import { useLocation } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";

const StudentLayout = () => {
  const navigate = useNavigate();

  const [hasReadyOrders, setHasReadyOrders] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
const location = useLocation();
const { setFlowStage } = useStudentData();

useEffect(() => {
  const path = location.pathname;

  if (path.startsWith("/student/shop")) {
    setFlowStage(2);
  } else if (path === "/student/orders") {
    setFlowStage(5);
  } else if (path === "/student") {
    setFlowStage(1);
  }
}, [location.pathname, setFlowStage]);

 const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    navigate("/login");
  }
};

  const isToday = (dateString) => {
  const d = new Date(dateString);
  const now = new Date();

  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

//   // 🔁 Poll for READY orders
//   useEffect(() => {
//   let interval;

//   const checkReadyOrders = async () => {
//     try {
//       const res = await getStudentOrders();
//       if (!res?.success) return;

//       const readyExists = res.data.some(
//         (o) =>
//           o.status === "ready" &&
//           !o.otp_verified &&
//           isToday(o.created_at)
//       );

//       if (readyExists && !acknowledged) {
//         setHasReadyOrders(true);
//       }

//       if (!readyExists) {
//         setHasReadyOrders(false);
//         setAcknowledged(false);
//       }
//     } catch (err) {
//       console.error("Ready order polling failed", err);
//     }
//   };

//   checkReadyOrders();
//   interval = setInterval(checkReadyOrders, 5000);

//   return () => clearInterval(interval);
// }, [acknowledged]);

  const handleOrdersClick = () => {
    setHasReadyOrders(false);
    setAcknowledged(true);
  };

   return (
    // <StudentDataProvider>
      <div className="student-layout-root">
        {/* Top Navbar */}
        <StudentNavbar onLogout={handleLogout}
        hasReadyOrders={hasReadyOrders}
        onOrdersClick={handleOrdersClick}/>

        {/* Main Dashboard Body */}
        <div className="student-layout-body">
          {/* LEFT SIDEBAR */}
          <aside className="student-sidebar">
            {/* Sidebar component comes next */}
            <StudentSidebar/>
          </aside>

          {/* CENTER CONTENT (FLUID) */}
          <main className="student-layout-center">
            <Outlet />
          </main>

          {/* RIGHT RAIL */}
          <aside className="student-right-rail">
            {/* Map + Support widgets come later */}
            <StudentRightRail/>
          </aside>
        </div>

        {/* Mobile Bottom Nav */}
        <StudentBottomNav />
      </div>
    // </StudentDataProvider>
  );
};

export default StudentLayout;
