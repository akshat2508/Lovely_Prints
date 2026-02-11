import "./StudentRightRail.css";
import mapImg from "../assets/map-illustration.png"; // placeholder (can swap later)

const StudentRightRail = () => {
  return (
    <div className="right-rail-inner">
      
      {/* MAP / GRAPHIC CARD */}
      <div className="rail-card map-card">
        <img
          src={mapImg}
          alt="Nearby print shops"
          className="map-graphic"
        />

        <div className="map-overlay">
          <h4>Nearby Print Shops</h4>
          <p>Optimized for fastest pickup</p>
        </div>
      </div>

      {/* SUPPORT CARD */}
      <div className="rail-card support-card">
        <div className="support-avatar">
          <span>👋</span>
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
