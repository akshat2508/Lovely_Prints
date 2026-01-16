import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"

import StudentHome from "../components/student/pages/StudentHome"
import ShopDetails from "../components/student/pages/ShopDetails"
import StudentOrders from "../components/student/pages/StudentOrders"

import ShopDashboard from "../components/shop/ShopDashboard"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student */}
      <Route path="/student" element={<StudentHome />} />
      <Route path="/student/shop/:shopId" element={<ShopDetails />} />
      <Route path="/student/orders" element={<StudentOrders />} />

      {/* Shop */}
      <Route path="/shop" element={<ShopDashboard />} />
    </Routes>
  )
}

export default AppRoutes
