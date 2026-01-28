// import { Navigate, Outlet } from "react-router-dom"

// const ProtectedRoute = ({ role }) => {
//   const token = localStorage.getItem("access_token")

//   // Not logged in
//   if (!token) {
//     return <Navigate to="/login" replace />
//   }

//   /**
//    * OPTIONAL (future):
//    * If you later store role in localStorage or context,
//    * you can check role here
//    */

//   return <Outlet />
// }

// export default ProtectedRoute


import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [checked, setChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthed(!!token);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
