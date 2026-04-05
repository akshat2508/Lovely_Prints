import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Package, KeyRound, ChevronDown, GripHorizontal, Scan } from "lucide-react";
import "./androidPopup_e.css";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.docuvio.app";
const EASE           = [0.16, 1, 0.3, 1];

/* QR image via qrserver — no extra package needed */
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=148x148&margin=6&color=111110&bgcolor=ffffff&data=${encodeURIComponent(PLAY_STORE_URL)}`;

/* ── Hook: true while viewport ≥ 1024px ── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

/* ── Play Store logo (badge only) ── */
function PlayStoreLogo({ size = 36 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size}>
      <defs>
        <clipPath id="ps-clip">
          <path d="M62 18 C42 28,30 48,30 70 L30 442 C30 464,42 484,62 494 C82 504,106 500,124 488 L482 274 C500 262,510 248,510 234 C510 220,500 206,482 194 L124 24 C106 12,82 8,62 18 Z"/>
        </clipPath>
      </defs>
      <g clipPath="url(#ps-clip)">
        <polygon points="30,18 270,256 30,256"          fill="#00C4AA" />
        <polygon points="30,256 270,256 30,494"          fill="#FFD000" />
        <polygon points="30,18 270,256 510,234 510,18"   fill="#FF3D00" />
        <polygon points="30,494 270,256 510,234 510,494" fill="#00C853" />
      </g>
    </svg>
  );
}

/* ── Desktop CTA: QR code block ── */
function QRBlock() {
  return (
    <div className="popup-qr-wrap_e">
      <div className="popup-qr-card_e">
        <img
          src={QR_URL}
          alt="Scan to download Docuvio on Google Play"
          className="popup-qr-img_e"
          width={148}
          height={148}
          loading="lazy"
          draggable={false}
        />
        {/* Corner accents */}
        <span className="popup-qr-corner_e tl_e" aria-hidden />
        <span className="popup-qr-corner_e tr_e" aria-hidden />
        <span className="popup-qr-corner_e bl_e" aria-hidden />
        <span className="popup-qr-corner_e br_e" aria-hidden />
      </div>

      <div className="popup-qr-label_e">
        <Scan size={13} strokeWidth={2} className="popup-qr-scan-icon_e" />
        <span>Scan with your phone's camera</span>
      </div>

      <p className="popup-hint_e" style={{ marginTop: 6 }}>
        Opens Google Play directly · Free · No ads
      </p>
    </div>
  );
}

/* ── Mobile CTA: keyboard-key button ── */
function DownloadButton({ onClick }) {
  return (
    <>
      <button className="popup-cta_e" onClick={onClick}>
        Download on Google Play
      </button>
      <p className="popup-hint_e">Free · No ads · 8 MB</p>
    </>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function AndroidAppPopup() {
  const [mode, setMode] = useState("idle"); // "idle" | "full" | "mini"
  const [dragPos, setDragPos] = useState(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const t = setTimeout(() => setMode("full"), 8000);
    return () => clearTimeout(t);
  }, []);

  const minimize = () => setMode("mini");
  const expand   = () => setMode("full");
  const download = () => window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");

  const miniStyle = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y }
    : { position: "fixed", right: 20, bottom: 24 };

  return (
    <>
      {/* ════════ FULL POPUP ════════ */}
      <AnimatePresence>
        {mode === "full" && (
          <>
            <motion.div
              key="backdrop"
              className="popup-backdrop_e"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={minimize}
            />

            <div className="popup-center_e">
              <motion.div
                key="card"
                className="popup-card_e"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{   opacity: 0, scale: 0.92, y: 24  }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <button className="popup-close_e" onClick={minimize} aria-label="Minimise">
                  <ChevronDown size={14} strokeWidth={2.5} />
                </button>

                <div className="popup-glow_e" aria-hidden />

                <div className="popup-icon-wrap_e">
                  <div className="popup-icon_e">
                    <PlayStoreLogo size={34} />
                  </div>
                </div>

                <div className="popup-panel_e">
                  <p className="popup-eyebrow_e">Available on Android</p>

                  <h2 className="popup-heading_e">Get the Docuvio App</h2>

                  <p className="popup-sub_e">
                    Upload docs, track orders &amp; collect prints — all from your pocket.
                  </p>

                  <div className="popup-pills_e">
                    <span className="popup-pill_e"><Zap      size={10} strokeWidth={2.5} /> Fast Uploads</span>
                    <span className="popup-pill_e"><Package  size={10} strokeWidth={2.5} /> Live Tracking</span>
                    <span className="popup-pill_e"><KeyRound size={10} strokeWidth={2.5} /> OTP Pickup</span>
                  </div>

                  {/* ── Adaptive CTA ── */}
                  {isDesktop
                    ? <QRBlock />
                    : <DownloadButton onClick={download} />
                  }
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ════════ MINI DRAGGABLE PILL ════════ */}
      <AnimatePresence>
        {mode === "mini" && (
          <motion.div
            key="mini"
            className="popup-mini_e"
            style={miniStyle}

            drag
            dragMomentum={false}
            dragElastic={0.08}

            onDragEnd={(_, info) => {
              setDragPos({
                x: Math.max(8, Math.min(info.point.x - 80, window.innerWidth  - 172)),
                y: Math.max(8, Math.min(info.point.y - 20, window.innerHeight -  52)),
              });
            }}

            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.22, ease: EASE }}

            onTap={expand}
          >
            <span className="popup-mini-grip_e" aria-hidden>
              <GripHorizontal size={11} />
            </span>
            <span className="popup-mini-dot_e"  aria-hidden />
            <span className="popup-mini-label_e">Get the App</span>
            <span className="popup-mini-live_e" aria-hidden>
              <span className="popup-mini-live-dot_e" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}