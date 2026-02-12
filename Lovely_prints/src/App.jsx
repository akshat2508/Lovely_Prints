import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "leaflet/dist/leaflet.css";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      navigate("/update-password", { replace: true });
    }
  }, []);

  return <AppRoutes />;
}
