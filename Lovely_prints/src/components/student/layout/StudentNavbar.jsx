import { NavLink } from "react-router-dom";
import "./studentNavbar.css";
import logo from "../../../assets/logo.png";

const StudentNavbar = ({
  onLogout,
  hasReadyOrders,
  onOrdersClick,
}) => {
  return (
    <header className="student-navbar-glass">
      {/* LEFT */}
      <div className="navbar-left">
        <img src={logo} alt="KaagaZ" className="navbar-logo" />
        <div className="navbar-brand">
         <span className="brand-name">
  Kaaga<span className="brand-z">Z</span>
</span>

        </div>
      </div>

      {/* CENTER */}
      <nav className="navbar-center">
        <NavLink to="/student" end>
          Home
        </NavLink>

        <NavLink
          to="/student/orders"
          onClick={onOrdersClick}
          className="orders-link"
        >
          Orders
          {hasReadyOrders && (
            <span className="ready-pill">READY</span>
          )}
        </NavLink>

        <NavLink to="/student/profile">
          Profile
        </NavLink>
      </nav>

      {/* RIGHT */}
      <div className="navbar-right">
        <button className="logout-glass-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default StudentNavbar;
