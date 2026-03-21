import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./printLoader.css";

const PrintStackLoader = () => {
  const modalRoot = document.getElementById("modal-root");
  const [progress, setProgress] = useState(0);

  // Fake realistic progress
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 12;
      if (value > 95) value = 95;
      setProgress(value);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (!modalRoot) return null;

  return createPortal(
    <div className="print-loader-overlay">
      <div className="print-loader-card">

        {/* PRINTER */}
        <div className="printer">

          <div className="printer-top" />

          {/* PAPER IN */}
          <motion.div
            className="paper paper-preview"
            initial={{ y: -80, opacity: 0 }}
            animate={{
              y: [-80, 30, 45],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* PRINT HEAD */}
          <motion.div
            className="print-head"
            animate={{
              y: [0, 40, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* PAPER OUT */}
          <motion.div
            className="paper paper-preview paper-out"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, 20, 65],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />

          <div className="paper-stack-base" />
          <div className="printer-bottom" />
        </div>

        {/* TEXT */}
        <p className="loader-text">Preparing your print order…</p>

        {/* PROGRESS BAR */}
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
        </div>

        <p className="loader-subtext">
          Redirecting to secure payment…
        </p>

      </div>
    </div>,
    modalRoot
  );
};

export default PrintStackLoader;