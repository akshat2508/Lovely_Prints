import { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { registerUser , getOrganisations } from "../../services/authService";
import "./auth.css";
import EmailConfirmationModal from "./modal/EmailConfirmationModal";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [organisationId, setOrganisationId] = useState("");

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

  const handleSignup = async () => {
    setError("");
    if (!organisationId) {
  setError("Please select your organisation");
  return;
}


    // ✅ Password match validation
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
        role: "student", // enforced by frontend
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
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="Lovely Prints" className="auth-logo" />

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register using your valid details</p>

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
          <select
  className="auth-input"
  value={organisationId}
  onChange={(e) => setOrganisationId(e.target.value)}
>
  <option value="">Select Organisation</option>
  {organisations.map((org) => (
    <option key={org.id} value={org.id}>
      {org.name}
    </option>
  ))}
</select>


          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ Confirm Password */}
          <input
            type="password"
            className="auth-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "tomato", fontSize: "0.85rem" }}>{error}</p>
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

      {showConfirmModal && (
        <EmailConfirmationModal
          email={email}
          onContinue={() => navigate("/login")}
        />
      )}
    </div>
  );
}
