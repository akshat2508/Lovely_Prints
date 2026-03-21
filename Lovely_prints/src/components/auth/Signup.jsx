import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { registerUser, getOrganisations } from "../../services/authService";
import "./signup.css";
import EmailConfirmationModal from "./modal/EmailConfirmationModal";
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = password.length >= 8;

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const data = await getOrganisations();
        setOrganisations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrganisations();
  }, []);

  const handleSignup = async () => {
    setError("");

    if (!organisationId) {
      setError("Select organisation");
      return;
    }

    if (!isPasswordValid) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
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

  return (
    <div className="su-root">
      <div className="su-grid" />

      <div className="su-left">
        <div className="su-left-content">
          <div className="su-logo-row">
            <img src={logo} alt="KaagaZ" className="su-logo-img" />
            <span className="su-logo-text">Docuvio</span>
          </div>

          <div className="su-badge">
            <span className="su-badge-dot" />
            CAMPUS PRINTING MARKETPLACE
          </div>

          <div className="su-headline">
            <div className="su-h-solid">Join the</div>
            <div className="su-h-green">Smarter.</div>
            <div className="su-h-outline">Campus.</div>
          </div>

          <p className="su-sub">
            Your campus printing hub.<br />
            Upload. Configure. Pay. Pick up.
          </p>
        </div>

        <div className="su-card">
          <div className="su-form-badge">CREATE ACCOUNT</div>
          <h2 className="su-form-title">Sign Up</h2>

          <div className="su-input-wrap">
            <User size={16} className="su-input-icon" />
            <input className="su-input" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="su-input-wrap">
            <Mail size={16} className="su-input-icon" />
            <input className="su-input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="su-input-wrap">
            <Building2 size={16} className="su-input-icon" />
            <select className="su-input su-select" value={organisationId} onChange={(e) => setOrganisationId(e.target.value)}>
              <option value="">Select organisation</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="su-pw-row">
            <div className={`su-input-wrap su-input-wrap-half ${
              password.length > 0 && !isPasswordValid ? "error" :
              password.length >= 8 ? "success" : ""
            }`}>
              <Lock size={16} className="su-input-icon" />
              <input
                className="su-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="su-eye-btn" onClick={() => setShowPassword((p) => !p)} type="button">
                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>

            <div className="su-input-wrap su-input-wrap-half">
              <Lock size={16} className="su-input-icon" />
              <input
                className="su-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="su-eye-btn" onClick={() => setShowConfirmPassword((p) => !p)} type="button">
                {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>

          {/* 🔥 Dynamic error while typing */}
          {password.length > 0 && password.length < 8 && (
            <div className="su-password-error">
              Password must be at least 8 characters
            </div>
          )}

          {error && <div className="su-error">{error}</div>}

          <button
            className={`su-btn${loading ? " su-btn-loading" : ""}`}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : (
              <span className="su-btn-inner">
                Create Account <ArrowRight size={16} />
              </span>
            )}
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <EmailConfirmationModal email={email} onContinue={() => navigate("/login")} />
      )}
    </div>
  );
}