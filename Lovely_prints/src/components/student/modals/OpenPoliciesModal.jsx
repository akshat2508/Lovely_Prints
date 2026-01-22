import "./modals.css";

const OpenPoliciesModal = ({ onAccept }) => {
  return (
    <div className="policy-overlay">
      <div className="policy-modal">
        <h2>📜 Lovely Prints – Usage Policies</h2>

        <div className="policy-content">
          <ul>
            <li>✔ Orders once paid cannot be cancelled</li>
            <li>✔ Carry your pickup OTP to collect prints</li>
            <li>✔ Shops are not responsible for incorrect files</li>
            <li>✔ Urgent orders may incur additional charges</li>
            <li>✔ Misuse of platform may lead to account suspension</li>
          </ul>
        </div>

        <label className="policy-checkbox">
          <input type="checkbox" id="policyCheck" />
          <span>I have read and agree to the policies</span>
        </label>

        <button
          className="policy-btn"
          onClick={() => {
            const checked = document.getElementById("policyCheck").checked;
            if (!checked) {
              alert("Please agree to the policies to continue");
              return;
            }
            onAccept();
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default OpenPoliciesModal;
