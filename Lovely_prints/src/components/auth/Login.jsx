import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import LoginLoader from "./LoginLoader";
import "./login.css";

const LOGO = "/src/assets/logo.png";
const EXPO = [0.16, 1, 0.3, 1];

const FEATURES = [
  { icon: "⚡", text: "Upload & print in under 2 minutes" },
  { icon: "🗺", text: "Browse every campus shop in real time" },
  { icon: "🔑", text: "OTP pickup — zero queues, zero stress" },
];

function FloatingBlob({ style, delay = 0 }) {
  return (
    <motion.div
      className="auth-blob_z"
      style={style}
      animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginLoader, setShowLoginLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      const role = res.data.user.user_metadata.role;

      setShowLoginLoader(true);

      setTimeout(() => {
        if (role === "student") navigate("/student");
        else if (role === "shop_owner") navigate("/shop");
        else if (role === "admin") navigate("/admin");
        else navigate("/login");
      }, 600);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root_z">

      {showLoginLoader && <LoginLoader />}

      {/* LEFT BRAND PANEL */}

      <div className="auth-left_z">

        <div className="auth-left-grid_z" />

        <FloatingBlob
          style={{
            width: 380,
            height: 380,
            top: "-100px",
            left: "-120px",
            background: "radial-gradient(circle, rgba(139,175,41,0.24) 0%, transparent 70%)"
          }}
        />

        <FloatingBlob
          style={{
            width: 300,
            height: 300,
            bottom: "40px",
            right: "-80px",
            background: "radial-gradient(circle, rgba(254,195,69,0.20) 0%, transparent 70%)"
          }}
          delay={2.5}
        />

        <FloatingBlob
          style={{
            width: 200,
            height: 200,
            top: "42%",
            left: "8%",
            background: "radial-gradient(circle, rgba(186,205,237,0.22) 0%, transparent 70%)"
          }}
          delay={1.5}
        />

        <div className="auth-left-inner_z">

          <motion.a
            href="/"
            className="auth-brand_z"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EXPO }}
          >
            <img src={LOGO} alt="KaagaZ" className="auth-logo_z" />
            <span className="auth-brand-name_z">KaagaZ</span>
          </motion.a>

          <motion.div
            className="auth-left-pill_z"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EXPO }}
          >
            <span className="auth-pill-dot_z" />
            Campus Printing Marketplace
          </motion.div>

          <motion.h1
            className="auth-left-h1_z"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: EXPO }}
          >
            Print <span className="auth-h1-sage_z">smarter.</span>
            <br />
            <span className="auth-h1-outline_z">Skip the queue.</span>
          </motion.h1>

          <motion.p
            className="auth-left-sub_z"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: EXPO }}
          >
            The campus printing platform built for students — fast, digital, completely queue-free.
          </motion.p>

          <motion.div
            className="auth-features_z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="auth-feat-row_z">
                <span className="auth-feat-icon_z">{f.icon}</span>
                <span className="auth-feat-text_z">{f.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>


      {/* RIGHT LOGIN PANEL */}

      <div className="auth-right_z">

        <motion.div
          className="auth-card_z"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EXPO }}
        >

          <div className="auth-card-header_z">
            <div className="auth-card-title_z">Login</div>
            <div className="auth-card-sub_z">
              Welcome back! Please login to your account...
            </div>
          </div>

          <form className="auth-form_z" onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className={`auth-field_z ${focusedField === "email" ? "focused_z" : ""}`}>
              <label className="auth-label_z">Email address</label>

              <div className="auth-input-wrap_z">
                <span className="auth-input-icon_z">
                  <Mail size={18} strokeWidth={1.75} />
                </span>

                <input
                  type="email"
                  className="auth-input_z"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
            </div>


            {/* PASSWORD */}

            <div className={`auth-field_z ${focusedField === "password" ? "focused_z" : ""}`}>
              <label className="auth-label_z">Password</label>

              <div className="auth-input-wrap_z">

                <span className="auth-input-icon_z">
                  <Lock size={18} strokeWidth={1.75} />
                </span>

                <input
                  type={showPass ? "text" : "password"}
                  className="auth-input_z"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="auth-eye-btn_z"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>
            </div>


            {/* FORGOT */}

            <div className="auth-row_z">
              <Link to="/forgot-password" className="auth-forgot_z">
                Forgot password?
              </Link>
            </div>


            {/* ERROR */}

            <AnimatePresence>
              {error && (
                <motion.div
                  className="auth-error_z"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>


            {/* LOGIN BUTTON */}

            <motion.button
              type="submit"
              className="auth-btn-primary_z"
              disabled={loading || !email || !password}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <span className="auth-spinner_z" /> : "Login →"}
            </motion.button>

          </form>


          <div className="auth-card-footer_z">
            New User?{" "}
            <Link to="/signup" className="auth-link_z">
              Create account →
            </Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
}