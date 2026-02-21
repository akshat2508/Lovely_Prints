import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { loginUser } from "../../services/authService"
import "./auth.css"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

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
    <div className="auth-page-clean">

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="left-content">
          <img src={logo} alt="KaagaZ" className="logo" />

          <h1>Print smarter.</h1>
          <h1>Collect faster.</h1>

          <p>
            Seamless campus printing experience.<br />
            Upload. Order. Pick up.
          </p>

          <div className="pills">
            <span>Quick Setup</span>
            <span>Secure</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">

        <div className="brand">
          <img src={logo} alt="logo" />
          <span>KaagaZ</span>
        </div>

        <div className="card">
          <h2>Login</h2>
          <p>Welcome back! Please login to your account</p>

          <div className="input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="links">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="signup">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}