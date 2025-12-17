import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./auth.css"

export default function Signup() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card">

        <img src={logo} alt="Lovely Prints" className="auth-logo" />

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Register using your student details
        </p>

        {/* Form */}
        <div className="auth-form">
          <input
            className="auth-input"
            placeholder="Full Name"
          />

          <input
            className="auth-input"
            placeholder="Email"
            type="email"
          />

          <input
            className="auth-input"
            placeholder="Student ID"
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
          />

          <button
            className="auth-btn"
            onClick={() => navigate("/student")}
          >
            Sign Up
          </button>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}
