import { NavLink } from "react-router-dom";
import "./studentNavbar.css";
import logo from "../../../assets/logo.png";

const StudentNavbar = ({
  onLogout,
  hasReadyOrders,
  onOrdersClick,
}) => {
  return (
    <nav className="student-navbar">
      <div className="nav-left">
        <img src={logo} alt="Lovely Prints" className="nav-logo" />
        <span className="nav-title">Lovely Prints</span>
      </div>

      <div className="nav-center">
        <NavLink to="/student" end>
          Home
        </NavLink>

        <NavLink
          to="/student/orders"
          onClick={onOrdersClick}
          className="nav-orders-link"
        >
          Orders
          {hasReadyOrders && (
            <span className="nav-ready-badge">READY</span>
          )}
        </NavLink>

        <NavLink to="/student/profile">
          Profile
        </NavLink>
      </div>

      <div className="nav-right">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
