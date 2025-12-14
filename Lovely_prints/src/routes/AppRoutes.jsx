import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import StudentDashboard from "../components/student/StudentDashboard"
import ShopDashboard from "../components/shop/ShopDashboard"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboards */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/shop" element={<ShopDashboard />} />
    </Routes>
  )
}

export default AppRoutes
