import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./verified.css";

export default function EmailVerified() {
  const gridRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth) * 8 - 4;
      const y = (e.clientY / window.innerHeight) * 8 - 4;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="ev-root">
      <div className="ev-grid" ref={gridRef} />

      <div className="ev-blob ev-blob-1" />
      <div className="ev-blob ev-blob-2" />
      <div className="ev-float-pill ev-pill-2">Welcome!</div>
      <div className="ev-float-pill ev-pill-3">You're in.</div>

      <div className="ev-center">
        <div className="ev-badge">
          <span className="ev-badge-dot" />
          EMAIL CONFIRMED
        </div>

        <div className="ev-icon-wrap">
          <div className="ev-icon-ring" />
          <div className="ev-icon-ring ev-ring-2" />
          <span className="ev-checkmark">✓</span>
        </div>

        <div className="ev-headline">
          <div className="ev-h-solid">Email</div>
          <div className="ev-h-green">Verified.</div>
          <div className="ev-h-outline">Let's Go.</div>
        </div>

        <p className="ev-sub">
          Your account is all set up and ready to go.<br />
          Start printing smarter on campus.
        </p>

        <Link to="/login" className="ev-btn">
          Continue to Login →
        </Link>
      </div>
    </div>
  );
}