import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({ role }) => {
  const token = localStorage.getItem("access_token")

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />
  }

  /**
   * OPTIONAL (future):
   * If you later store role in localStorage or context,
   * you can check role here
   */

  return <Outlet />
}

export default ProtectedRoute
