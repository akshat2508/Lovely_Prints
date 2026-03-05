import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./NotFound.css";

export default function NotFound() {
  const gridRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth) * 10 - 5;
      const y = (e.clientY / window.innerHeight) * 10 - 5;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="nf-root">
      {/* Parallax grid */}
      <div className="nf-grid" ref={gridRef} />

      {/* Floating blobs */}
      <div className="nf-blob nf-blob-1" />
      <div className="nf-blob nf-blob-2" />

      {/* Floating pills */}
      <div className="nf-float-pill nf-pill-1">404</div>
      <div className="nf-float-pill nf-pill-2">Lost?</div>
      <div className="nf-float-pill nf-pill-3">Oops.</div>

      <div className="nf-center">
        {/* Badge */}
        <div className="nf-badge">
          <span className="nf-badge-dot" />
          PAGE NOT FOUND
        </div>

        {/* Big number */}
        <div className="nf-big">
          <span className="nf-four nf-solid">4</span>
          <span className="nf-zero nf-green">0</span>
          <span className="nf-four nf-outline">4</span>
        </div>

        <p className="nf-title">Looks like this page went to the print shop and never came back.</p>
        <p className="nf-sub">The page you're looking for doesn't exist or has been moved.</p>

        {/* Floating doc card */}
        <div className="nf-doc-card">
          <div className="nf-doc-top">
            <span className="nf-doc-icon">📄</span>
            <div>
              <div className="nf-doc-name">page_not_found.pdf</div>
              <div className="nf-doc-meta">0 pages · Missing</div>
            </div>
          </div>
          <div className="nf-doc-status">✗ NOT FOUND</div>
        </div>

        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">Go Home</Link>
          <Link to="/login" className="nf-btn-secondary">Login →</Link>
        </div>
      </div>
    </div>
  );
}