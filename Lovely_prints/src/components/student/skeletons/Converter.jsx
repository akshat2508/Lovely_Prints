import { createPortal } from "react-dom";
import "./convertor-j.css";



const Convertor = ({ text = "Converting Your Docx into PDF for better formatting..." }) => {
      const modalRoot = document.getElementById("modal-root");

  return createPortal(
    <div className="print-wrapper-j">

      <div className="printer-j">

        {/* TOP SLOT */}
        <div className="printer-top-j"></div>

        {/* PAPER IN (DOCX) */}
        <div className="paper-in-j">
          <span>DOCX</span>
        </div>

        {/* PRINTER BODY */}
        <div className="printer-body-j">
          <div className="printer-light-j"></div>
        </div>

        {/* PAPER OUT (PDF) */}
        <div className="paper-out-j">
          <span>PDF</span>
        </div>

      </div>

      <p className="print-text-j">{text}</p>
    </div>,
    modalRoot
  );
};
export default Convertor; 