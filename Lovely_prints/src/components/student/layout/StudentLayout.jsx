import { Outlet, useNavigate } from "react-router-dom"
import StudentNavbar from "./StudentNavbar"
import StudentBottomNav from "./StudentBottomNav"
import { logoutUser } from "../../../services/authService"
import { StudentDataProvider } from "../context/StudentDataContext"

const StudentLayout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate("/login")
  }

  return (
    <StudentDataProvider>
      <StudentNavbar onLogout={handleLogout} />
      <Outlet />
      <StudentBottomNav />
    </StudentDataProvider>
  )
}

export default StudentLayout
