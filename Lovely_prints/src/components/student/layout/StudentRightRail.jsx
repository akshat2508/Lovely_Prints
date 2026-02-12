import "./StudentRightRail.css";
import mapImg from "../assets/map-illustration.png"; // placeholder (can swap later)
import { Headset } from "lucide-react";
import LiveMap from "../../liveMap/LiveMap";
const StudentRightRail = () => {
  return (
    <div className="right-rail-inner">
      
      {/* MAP / GRAPHIC CARD */}
      <div className="rail-card map-card">
        <LiveMap/>

        <div className="map-overlay">
          <h4>Nearby Print Shops</h4>
          <p>Will Soon be available for real time navigation</p>
        </div>
      </div>

      {/* SUPPORT CARD */}
      <div className="rail-card support-card">
        <div className="support-avatar">
    <Headset size={22} strokeWidth={2} />
        </div>

        <div className="support-text">
          <strong>Need help?</strong>
          <p>We’re here to assist you</p>
        </div>

        <button className="support-btn">
          Contact Support
        </button>
      </div>

    </div>
  );
};

export default StudentRightRail;
