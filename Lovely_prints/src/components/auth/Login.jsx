import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { loginUser } from "../../services/authService"
import "./auth.css"
import LoginLoader from "./LoginLoader"
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoginLoader, setShowLoginLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await loginUser({ email, password })

      const role = res.data.user.user_metadata.role
 // 🔥 SHOW FULLSCREEN LOADER
    setShowLoginLoader(true);

    // ⏳ tiny delay so loader feels intentional (UX trick)
    setTimeout(() => {
      if (role === "student") navigate("/student");
      else if (role === "shop_owner") navigate("/shop");
      else if (role === "admin") navigate("/admin");
      else navigate("/login");
    }, 600);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {showLoginLoader && <LoginLoader />}

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

        <div style={{ marginTop: "1rem", position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="eye-toggle"
          onClick={() => setShowPassword(p => !p)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
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
        <p style={{ marginTop: "0.6rem", textAlign: "right" }}>
  <Link to="/forgot-password" className="auth-link">
    Forgot password?
  </Link>
</p>

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
