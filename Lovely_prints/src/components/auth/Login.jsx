import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { loginUser } from "../../services/authService"
import "./auth.css"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      const role = res.data.user.user_metadata.role
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
    <div className="ln-root">
      <div className="ln-grid" />

      {/* LEFT PANEL */}
      <div className="ln-left">
        <div className="ln-left-content">
          <div className="ln-logo-row">
            <img src={logo} alt="KaagaZ" className="ln-logo-img" />
            <span className="ln-logo-text">Docuvio</span>
          </div>

          <div className="ln-badge">
            <span className="ln-badge-dot" />
            CAMPUS PRINTING MARKETPLACE
          </div>

          <div className="ln-headline">
            <div className="ln-h-solid">Welcome</div>
            <div className="ln-h-green">Back.</div>
            <div className="ln-h-outline">Print On.</div>
          </div>

          <p className="ln-sub">
            Your campus printing hub.<br />
            Upload. Order. Pick up. No queues.
          </p>

          <div className="ln-pills">
            {["Quick Setup", "Secure", "Instant Pay"].map((p) => (
              <span key={p} className="ln-pill">{p}</span>
            ))}
          </div>
        </div>

      {/* RIGHT PANEL */}
        <div className="ln-card">
          <div className="ln-form-badge">SIGN IN</div>
          <h2 className="ln-form-title">Login</h2>
          <p className="ln-form-sub">Welcome back! Please login to your account</p>

          <div className="ln-input-wrap">
            <Mail size={16} className="ln-input-icon" />
            <input
              className="ln-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="ln-input-wrap">
            <Lock size={16} className="ln-input-icon" />
            <input
              className="ln-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="ln-eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {error && <div className="ln-error">{error}</div>}

          <button
            className={`ln-btn${loading ? " ln-btn-loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : (
              <span className="ln-btn-inner">Login <ArrowRight size={16} /></span>
            )}
          </button>

          <div className="ln-forgot-row">
            <Link to="/forgot-password" className="ln-forgot-link">Forgot password?</Link>
          </div>

          <div className="ln-divider">
            <span className="ln-divider-line" />
            <span className="ln-divider-text">or</span>
            <span className="ln-divider-line" />
          </div>

          <div className="ln-signup-row">
            Don't have an account? <Link to="/signup" className="ln-signup-link">Sign up →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}