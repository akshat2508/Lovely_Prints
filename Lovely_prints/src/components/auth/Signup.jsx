import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { registerUser, getOrganisations } from "../../services/authService";
import "./auth.css";
import "./signup.css";
import EmailConfirmationModal from "./modal/EmailConfirmationModal";
import { Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";

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
    <div className="auth-page-clean">

      {/* LEFT PANEL */}
      <div className="auth-visual">
        <div className="visual-content">
          <img src={logo} alt="KaagaZ" className="visual-logo" />

          <h1>Print smarter.</h1>
          <h1>Collect faster.</h1>

          <p>
            Seamless campus printing experience.
            <br />
            Upload. Order. Pick up.
          </p>

          <div className="feature-pills">
            <div className="feature-pill">Quick Setup</div>
            <div className="feature-pill">Secure</div>
            <div className="feature-pill">Fast</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-form-side">

        {/* LOGO */}
        <div className="auth-logo-inline">
          <img src={logo} alt="KaagaZ" />
          <span>KaagaZ</span>
        </div>

        {/* CARD */}
        <div className="auth-card-clean">
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Start printing smarter</p>

          {/* Name */}
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Organisation */}
          <div className="input-group">
            <Building2 size={18} />
            <select
              value={organisationId}
              onChange={(e) => setOrganisationId(e.target.value)}
            >
              <option value="">Select organisation</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword((p) => !p)}>
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={() => setShowConfirmPassword((p) => !p)}>
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && <div className="error">{error}</div>}

          {/* Button */}
          <button
            className="login-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div className="signup">
            Already have an account? <Link to="/login">Login</Link>
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