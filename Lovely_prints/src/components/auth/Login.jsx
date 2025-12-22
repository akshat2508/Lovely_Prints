import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { loginUser } from "../../services/authService"
import "./auth.css"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await loginUser({ email, password })

      const role = res.data.user.user_metadata.role

      // ✅ Route based on role
      if (role === "student") navigate("/student")
      else if (role === "shop_owner") navigate("/shop")
      else if (role === "admin") navigate("/admin")
      else navigate("/login")

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "tomato", marginTop: "0.8rem", fontSize: "0.85rem" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <button
            className="auth-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
