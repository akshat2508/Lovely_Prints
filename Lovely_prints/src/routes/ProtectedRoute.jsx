import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ role }) => {
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");

    setToken(storedToken);
    setUserRole(storedRole);
    setChecked(true);
  }, []);

  if (!checked) return null;

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if role not yet available, allow render
  if (role && userRole && userRole !== role) {
    if (userRole === "student") return <Navigate to="/student" replace />;
    if (userRole === "shop") return <Navigate to="/shop" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;