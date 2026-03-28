import { createPortal } from "react-dom";
import {
  FileText,
  FileCheck,
  Printer,
  Clock,
  X
} from "lucide-react";
import "./instructionModal-j.css";

const InstructionsModal = ({ onClose }) => {
  const modalRoot = document.getElementById("modal-root");

  return createPortal(
    <div className="instructions-overlay-j">

      <div className="instructions-modal-j">

        {/* HEADER */}
        <div className="instructions-header-j">
          <div>
            <h2>Printing Guide</h2>
            <p>Quick tips for best results</p>
          </div>

          <button className="close-btn-j" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="instructions-content-j">

          <div className="instruction-card-j">
            <FileText size={18} />
            <div>
              <h4>File Upload</h4>
              <p>DOCX files are converted to PDF for accurate pricing.</p>
            </div>
          </div>

          <div className="instruction-card-j">
            <FileCheck size={18} />
            <div>
              <h4>CV Mode</h4>
              <p>Applies clean, professional settings automatically.</p>
            </div>
          </div>

          <div className="instruction-card-j">
            <Printer size={18} />
            <div>
              <h4>Print Quality</h4>
              <p>Use high-quality PDFs for best print output.</p>
            </div>
          </div>

          <div className="instruction-card-j">
            <Clock size={18} />
            <div>
              <h4>Pickup Timing</h4>
              <p>Next-day orders include a handling fee.</p>
            </div>
          </div>

        </div>

      </div>
    </div>,
    modalRoot
  );
};

export default InstructionsModal;