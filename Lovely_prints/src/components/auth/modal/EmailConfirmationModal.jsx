import "./confirmation.css";
import logo from "../../../assets/logo.png";

const EmailConfirmationModal = ({ email, onContinue }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <img src={logo} alt="Lovely Prints" className="confirm-logo" />

        <h2>Confirm your email</h2>

        <p className="confirm-text">
          We’ve sent a confirmation link to
        </p>

        <p className="confirm-email">{email}</p>

        <p className="confirm-subtext">
          Please check your inbox and confirm your email address to continue.
        </p>

        <button className="confirm-btn" onClick={onContinue}>
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
