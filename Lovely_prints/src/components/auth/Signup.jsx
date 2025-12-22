import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { registerUser } from "../../services/authService"
import "./auth.css"

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    setError("")
    setLoading(true)

    try {
      await registerUser({
        name,
        email,
        password,
        role: "student", // ✅ enforced by frontend
      })

      // After successful signup → go to login
      navigate("/login")

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <img src={logo} alt="Lovely Prints" className="auth-logo" />

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Register using your student details
        </p>

        <div className="auth-form">
          <input
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "tomato", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          <button
            className="auth-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
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
