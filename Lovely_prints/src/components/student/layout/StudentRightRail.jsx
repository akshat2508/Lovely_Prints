import "./StudentRightRail.css";
import mapImg from "../assets/map-illustration.png";
import { Headset } from "lucide-react";
import LiveMap from "../../liveMap/LiveMap";
import SupportForm from "./SupportForm";
import { useState } from "react";

const StudentRightRail = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm && (
  <SupportForm
    isOpen={showForm}
    onClose={() => setShowForm(false)}
  />
)}

      <div className="right-rail-inner">
        
        {/* MAP CARD */}
        <div className="rail-card map-card">
          <LiveMap />

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

          <button
            className="support-btn"
            onClick={() => setShowForm(true)}
          >
            Contact Support
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentRightRail;