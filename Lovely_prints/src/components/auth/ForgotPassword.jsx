import { useState } from "react";
import { supabase } from "../../services/supabase";
import "./f.css"
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }

    setLoading(false);
  };

  return (
   <div className="auth-page-F">
  <div className="auth-card-F">
    <h2 className="auth-title-F">Forgot Password</h2>

    <input
      className="auth-input-F"
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {error && <p className="auth-error-F">{error}</p>}
    {message && <p className="auth-success-F">{message}</p>}

    <button
      className="auth-btn-F"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? "Sending..." : "Send reset link"}
    </button>
  </div>
</div>

  );
}
