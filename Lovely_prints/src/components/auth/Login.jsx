import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { loginUser } from "../../services/authService"
import "./auth.css"
import LoginLoader from "./LoginLoader"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoginLoader, setShowLoginLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await loginUser({ email, password })

      const role = res.data.user.user_metadata.role
      // 🔥 SHOW FULLSCREEN LOADER
      setShowLoginLoader(true)

      // ⏳ tiny delay so loader feels intentional (UX trick)
      setTimeout(() => {
        if (role === "student") navigate("/student")
        else if (role === "shop_owner") navigate("/shop")
        else if (role === "admin") navigate("/admin")
        else navigate("/login")
      }, 600)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password && !loading) {
      handleLogin()
    }
  }

  return (
    <div className="auth-page-lp">
      {showLoginLoader && <LoginLoader />}

      <div className="auth-layout-lp">
        {/* LEFT VISUAL PANEL */}
        <div className="auth-visual-lp">
          <div className="visual-overlay" />

          {/* Animated particles */}
          <div className="particles-container">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>

          <div className="visual-content">
            <div className="logo-container">
              <img src={logo} alt="Lovely Prints" className="visual-logo" />
              <div className="logo-shine"></div>
            </div>

            <h1 className="visual-heading">
              <span className="heading-line">Print Smarter.</span>
              <span className="heading-line">Collect Faster.</span>
            </h1>

            <p className="visual-description">
              Campus printing made seamless.
              <br />
              Order. Track. Pick up.
            </p>

            {/* Feature pills */}
            <div className="feature-pills">
              <div className="feature-pill">
                <Sparkles size={14} />
                <span>Instant Orders</span>
              </div>
              <div className="feature-pill">
                <Sparkles size={14} />
                <span>Real-time Tracking</span>
              </div>
              <div className="feature-pill">
                <Sparkles size={14} />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="auth-form-panel-lp">
          <div className="auth-card-lp">
            <div className="card-header">
              <h2 className="card-title">Welcome Back</h2>
              <p className="subtitle">Login to continue to your dashboard</p>
            </div>

            <div className="auth-form">
              {/* Email Input */}
              <div className={`input-group ${emailFocused ? "focused" : ""} ${email ? "filled" : ""}`}>
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="auth-input-lp"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className={`input-group ${passwordFocused ? "focused" : ""} ${password ? "filled" : ""}`}>
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="auth-input-lp"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="auth-error-lp">
                  <div className="error-content">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 4.5V8.5M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                className={`auth-btn-lp ${loading ? "loading" : ""}`}
                onClick={handleLogin}
                disabled={loading || !email || !password}
              >
                <span className="btn-content">
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={18} className="btn-icon" />
                    </>
                  )}
                </span>
                <div className="btn-shine"></div>
              </button>

              {/* Links */}
              <div className="auth-links">
                <Link to="/forgot-password" className="forgot-link-lp">
                  Forgot password?
                </Link>
              </div>

              <div className="divider">
                <span>New to KaagaZ?</span>
              </div>

              <div className="signup-link-lp">
                Don't have an account?{" "}
                <Link to="/signup" className="signup-cta">
                  Create one
                  <ArrowRight size={14} className="link-arrow" />
                </Link>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="currentColor" />
              </svg>
              <span>Secure Login</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="6" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 6V4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4V6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}