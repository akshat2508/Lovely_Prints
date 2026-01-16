import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

import StudentLayout from "../components/student/layout/StudentLayout";
import StudentHome from "../components/student/pages/StudentHome";
import ShopDetails from "../components/student/pages/ShopDetails";
import StudentOrders from "../components/student/pages/StudentOrders";
import ProtectedRoute from "./ProtectedRoute";
import ShopDashboard from "../components/shop/ShopDashboard";
import StudentProfile from "../components/student/pages/StudentProfile";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student (Protected) */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path="shop/:shopId" element={<ShopDetails />} />
          <Route path="orders" element={<StudentOrders />} />
          <Route path="profile" element={<StudentProfile />} />

        </Route>
      </Route>

      {/* Shop */}
      <Route path="/shop" element={<ShopDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
