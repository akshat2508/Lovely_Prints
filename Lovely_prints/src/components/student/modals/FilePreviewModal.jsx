import { createPortal } from "react-dom";
import "./filePreviewModal.css";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  const fileURL = URL.createObjectURL(file);
  const fileType = file.type;
  const modalRoot = document.getElementById("modal-root");

  return createPortal(
    <div className="preview-overlay-p">
      <div className="preview-modal-p">

        {/* HEADER */}
        <div className="preview-header-p">
          <h3>File Preview</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="preview-body-p">
          {fileType === "application/pdf" ? (
            <iframe
              src={fileURL}
              title="PDF Preview"
              width="100%"
              height="500px"
            />
          ) : fileType.startsWith("image/") ? (
            <img src={fileURL} alt="Preview" />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>

      </div>
    </div>,
    modalRoot
  );
};

export default FilePreviewModal;