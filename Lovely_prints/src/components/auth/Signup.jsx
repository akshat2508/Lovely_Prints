import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./auth.css"

export default function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState("student")

  return (
    <div className="auth-page">
      <div className="auth-card">

        <img src={logo} alt="Lovely Prints" className="auth-logo" />

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Register as Student or Shopkeeper
        </p>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={`role-btn ${role === "shop" ? "active" : ""}`}
            onClick={() => setRole("shop")}
          >
            Shopkeeper
          </button>
        </div>

        {/* Form */}
        <div className="auth-form">
          <input className="auth-input" placeholder="Full Name" />
          <input className="auth-input" placeholder="Email" />

          {role === "student" && (
            <input className="auth-input" placeholder="Student ID" />
          )}

          {role === "shop" && (
            <input className="auth-input" placeholder="Shop Name / Block No." />
          )}

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
          />

          <button
            className="auth-btn"
            onClick={() =>
              role === "student" ? navigate("/student") : navigate("/shop")
            }
          >
            Sign Up as {role === "student" ? "Student" : "Shopkeeper"}
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
