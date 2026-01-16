import { NavLink } from "react-router-dom"
import { Home, Package, User } from "lucide-react"
import "./studentBottomNav.css"

const StudentBottomNav = () => {
  return (
    <nav className="student-bottom-nav">
      <NavLink to="/student" end>
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/student/orders">
        <Package size={22} />
        <span>Orders</span>
      </NavLink>

      <NavLink to="/student/profile">
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}

export default StudentBottomNav
