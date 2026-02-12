import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { registerUser, getOrganisations } from "../../services/authService";
import "./auth.css";
import EmailConfirmationModal from "./modal/EmailConfirmationModal";
import { Eye, EyeOff, Mail, Lock, User, Building2, CheckCircle2, ArrowRight, Sparkles, Shield, Users, Zap } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [organisationId, setOrganisationId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [orgFocused, setOrgFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const data = await getOrganisations();
        setOrganisations(data);
      } catch (err) {
        console.error("Failed to load organisations", err);
      }
    };

    fetchOrganisations();
  }, []);

  useEffect(() => {
    // Calculate password strength
    if (password.length === 0) {
      setPasswordStrength(0);
    } else if (password.length < 6) {
      setPasswordStrength(1);
    } else if (password.length < 10) {
      setPasswordStrength(2);
    } else {
      setPasswordStrength(3);
    }
  }, [password]);

  const handleSignup = async () => {
    setError("");
    if (!organisationId) {
      setError("Please select your organisation");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    console.log("Selected organisationId:", organisationId);

    try {
      await registerUser({
        name,
        email,
        password,
        role: "student",
        organisation_id: organisationId,
      });

      setShowConfirmModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1:
        return "Weak";
      case 2:
        return "Good";
      case 3:
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "#ef4444";
      case 2:
        return "#f59e0b";
      case 3:
        return "#10b981";
      default:
        return "#e2e8f0";
    }
  };

  return (
    <div className="auth-page-lp">
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
              <span className="heading-line">Join Our</span>
              <span className="heading-line">Community.</span>
            </h1>

            <p className="visual-description">
              Start your journey with seamless printing.
              <br />
              Create. Order. Collect.
            </p>

            {/* Feature pills */}
            <div className="feature-pills">
              <div className="feature-pill">
                <Zap size={14} />
                <span>Quick Setup</span>
              </div>
              <div className="feature-pill">
                <Shield size={14} />
                <span>Secure Account</span>
              </div>
              <div className="feature-pill">
                <Users size={14} />
                <span>Campus Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="auth-form-panel-lp">
          <div className="auth-card-lp">
            <div className="card-header">
              <h2 className="card-title">Create Account</h2>
              <p className="subtitle">Join us today and start printing smarter</p>
            </div>

            <div className="auth-form">
              {/* Name Input */}
              <div className={`input-group ${nameFocused ? "focused" : ""} ${name ? "filled" : ""}`}>
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="auth-input-lp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              {/* Organisation Select */}
              <div className={`input-group ${orgFocused ? "focused" : ""} ${organisationId ? "filled" : ""}`}>
                <label className="input-label">Organisation</label>
                <div className="input-wrapper">
                  <Building2 size={18} className="input-icon" />
                  <select
                    className="auth-input-lp auth-select-lp"
                    value={organisationId}
                    onChange={(e) => setOrganisationId(e.target.value)}
                    onFocus={() => setOrgFocused(true)}
                    onBlur={() => setOrgFocused(false)}
                  >
                    <option value="">Select your organisation</option>
                    {organisations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Input */}
              <div className={`input-group ${passwordFocused ? "focused" : ""} ${password ? "filled" : ""}`}>
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="auth-input-lp"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
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
                {password && (
                  <div className="password-strength-indicator">
                    <div className="strength-bars">
                      <div
                        className="strength-bar"
                        style={{
                          backgroundColor: passwordStrength >= 1 ? getStrengthColor() : "#e2e8f0",
                        }}
                      />
                      <div
                        className="strength-bar"
                        style={{
                          backgroundColor: passwordStrength >= 2 ? getStrengthColor() : "#e2e8f0",
                        }}
                      />
                      <div
                        className="strength-bar"
                        style={{
                          backgroundColor: passwordStrength >= 3 ? getStrengthColor() : "#e2e8f0",
                        }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: getStrengthColor() }}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className={`input-group ${confirmPasswordFocused ? "focused" : ""} ${confirmPassword ? "filled" : ""}`}>
                <label className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <CheckCircle2 size={18} className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="auth-input-lp"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {!showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

              {/* Signup Button */}
              <button
                className={`auth-btn-lp ${loading ? "loading" : ""}`}
                onClick={handleSignup}
                disabled={loading}
              >
                <span className="btn-content">
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={18} className="btn-icon" />
                    </>
                  )}
                </span>
                <div className="btn-shine"></div>
              </button>

              <div className="divider">
                <span>Already a member?</span>
              </div>

              <div className="signup-link-lp">
                Already have an account?{" "}
                <Link to="/login" className="signup-cta">
                  Sign in
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
              <span>Free to Join</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="6" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 6V4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4V6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <EmailConfirmationModal
          email={email}
          onContinue={() => navigate("/login")}
        />
      )}
    </div>
  );
}