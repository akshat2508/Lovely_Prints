import logo from "../../assets/logo.png";
import "./loginLoader.css";

const LoginLoader = ({ message = "Preparing your dashboard..." }) => {
  return (
    <div className="login-loader-overlay">
      <div className="login-loader-card">
        <img src={logo} alt="Lovely Prints" className="login-loader-logo" />

        <div className="login-loader-spinner" />

        <p className="login-loader-text">{message}</p>
      </div>
    </div>
  );
};

export default LoginLoader;
