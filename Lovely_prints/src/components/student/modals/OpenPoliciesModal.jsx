import "./modals.css";

const OpenPoliciesModal = ({ onAccept }) => {
  return (
    <div className="policy-overlay">
      <div className="policy-modal">
        <h2>📜 Docuvio – Usage Policies</h2>

        <div className="policy-content">
          <ul>
  <li>✔ Orders once paid are final and cannot be cancelled or refunded</li>

  <li>
    ✔ All uploaded files are automatically scanned for inappropriate or
    prohibited content; violations may result in immediate account suspension
    or permanent ban
  </li>

  <li>
    ✔ Customers must carry the pickup OTP to collect their prints
  </li>

  <li>
    ✔ Orders must be collected on the same day they are printed; uncollected
    orders will be discarded after the same day
  </li>

  <li>
    ✔ Neither the print shop nor Lovely Prints will be responsible for any
    loss, damage, or claims related to uncollected or discarded orders
  </li>

  <li>
    ✔ Print shops are not responsible for errors caused by incorrect or
    low-quality files uploaded by users
  </li>

  <li>
    ✔ Misuse of the platform, including policy violations or abusive behavior,
    may lead to account suspension or permanent termination
  </li>
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
