import "./modals.css";
import { useState } from "react";
import { createPortal } from "react-dom"
const OpenPoliciesModal = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);
  return createPortal(
  <div className="policy-overlay">
    <div className="policy-modal">
      <h2>📜 Docuvio – Usage Policies</h2>

      <div className="policy-content">
        <ul>
          <li>✔ Refunds shall be issued solely in the event of verified technical failures attributable to our system.</li>

          <li>✔ All uploaded files are automatically scanned for inappropriate or prohibited content; violations may result in immediate account suspension or permanent ban</li>

          <li>✔ All uploaded files are subject to automated content screening. Uploading prohibited or inappropriate content may result in immediate account suspension or permanent termination.</li>

          <li>✔ Customers must present the valid pickup OTP at the time of collection.</li>

          <li>✔ Orders must be collected within the selected time slot. Failure to do so may result in delays or cancellation of service.</li>

          <li>✔ Scheduled orders for the next day cannot be placed via the app between 12:00 AM and 6:00 AM. Additional charges will be applied for scheduled orders.</li>

          <li>✔ All orders must be collected on the same day of printing before the closing time of the shop. Uncollected orders will be discarded after the end of the day without prior notice.</li>

          <li>✔ Neither the print shop nor Docuvio shall be liable for any loss, damage, or claims arising from uncollected or discarded orders.</li>

          <li>✔ Print shops are not responsible for errors resulting from incorrect, incomplete, or low-quality files submitted by users.</li>

          <li>✔ Any misuse of the platform, including policy violations or abusive behavior, may lead to suspension or permanent termination of the account.</li>
        </ul>
      </div>

      <label className="policy-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>I have read and agree to the policies</span>
      </label>

      <button
        className="policy-btn"
        onClick={() => {
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
  </div>,
  document.getElementById("modal-root")
);
};

export default OpenPoliciesModal;
