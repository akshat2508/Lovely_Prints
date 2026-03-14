import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import "./resetPassword.css"
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const verifyAndSetSession = async () => {
      try {
        // Get token from URL params
        const params = new URLSearchParams(window.location.search);
        const tokenHash = params.get('token_hash');
        const type = params.get('type');

        console.log('URL params:', { tokenHash: tokenHash ? 'PRESENT' : 'MISSING', type });

        if (!tokenHash || type !== 'recovery') {
          setError("Invalid reset link. Please request a new password reset.");
          return;
        }

        // Verify the OTP token
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });

        if (verifyError) {
          console.error('Verify error:', verifyError);
          setError("Invalid or expired reset link. Please request a new one.");
          return;
        }

        if (data?.session) {
          console.log('✅ Session verified successfully');
          setSessionReady(true);
        } else {
          setError("Failed to establish session. Please try again.");
        }
      } catch (err) {
        console.error('Error:', err);
        setError("An error occurred. Please try again.");
      }
    };

    verifyAndSetSession();
  }, []);

  const handleUpdatePassword = async () => {
    if (!sessionReady) {
      setError("Session not ready. Please try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Update error:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    alert("Password updated successfully!");
    navigate("/login");
  };

  return (
   <div className="auth-page-F">
  <div className="auth-card-F">
    <h2 className="auth-title-F">Reset Password</h2>

    {!sessionReady && !error && (
      <p className="auth-info-F">Verifying reset link...</p>
    )}

   <div className="password-field-F">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New password (min 6 characters)"
    className="auth-input-F"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    disabled={!sessionReady}
  />

  <button
    type="button"
    className="eye-toggle-F"
    onClick={() => setShowPassword(p => !p)}
    disabled={!sessionReady}
  >
    {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>


<div className="password-field-F">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Confirm new password"
    className="auth-input-F"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    disabled={!sessionReady}
  />

  <button
    type="button"
    className="eye-toggle-F"
    onClick={() => setShowPassword(p => !p)}
    disabled={!sessionReady}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>


    {error && <p className="auth-error-F">{error}</p>}

    <button
      className="auth-btn-F"
      onClick={handleUpdatePassword}
      disabled={loading || !sessionReady}
    >
      {loading ? "Updating..." : "Update Password"}
    </button>

    <button
      className="auth-link-btn-F"
      onClick={() => navigate("/forgot-password")}
    >
      Request new reset link
    </button>
  </div>
</div>

  );
}