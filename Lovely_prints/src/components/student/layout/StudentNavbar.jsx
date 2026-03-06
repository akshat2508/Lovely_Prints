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
          Docuvio
</span>

        </div>
      </div>

      {/* CENTER */}
     <nav className="navbar-center">
  <div className="nav-pill-container">
    <NavLink to="/student" end>
      Home
    </NavLink>

    <NavLink
      to="/student/orders"
      onClick={onOrdersClick}
      className="orders-link"
    >
      Order
    </NavLink>

    <NavLink to="/student/profile">
      Profile
    </NavLink>
  </div>
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
