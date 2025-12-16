import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./auth.css"   // 👈 local css

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card">

        <img src={logo} alt="Lovely Prints" className="auth-logo" />

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Login to access digital print services
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
          />
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <button
            className="auth-btn"
            onClick={() => navigate("/student")}
          >
            Login
          </button>
        </div>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
