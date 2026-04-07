import { useEffect, useState } from "react";
import {
  motion, AnimatePresence, useAnimationControls,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  GripHorizontal,
  Wifi,
  BatteryFull,
  Signal,
  Download,
  ScanLine,
  Printer,
  Package,
  GraduationCap,
  Info,
  Gamepad2,
  LayoutGrid,
  BookOpen,
  MoreVertical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import LOGO from "../../assets/logo.png";
import "./androidPopup_e.css";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.docuvio.app";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=5&color=1a1a1a&bgcolor=ffffff&data=${encodeURIComponent(PLAY_STORE_URL)}`;
const EASE = [0.16, 1, 0.3, 1];

/* ── Responsive hook ── */
function useIsDesktop() {
  const [v, setV] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width:1024px)");
    const h = (e) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

/* ── Screenshot cards — fake Play Store previews ── */
const SCREENSHOTS = [
  {
    from: "#4a90d9", to: "#1565c0",
    icon: <Printer size={18} strokeWidth={1.8} />,
    label: "Upload & Print Anywhere",
  },
  {
    from: "#43a047", to: "#1b5e20",
    icon: <ShieldCheck size={18} strokeWidth={1.8} />,
    label: "Pay Securely",
  },
  {
    from: "#f57c00", to: "#bf360c",
    icon: <Package size={18} strokeWidth={1.8} />,
    label: "Track Your Order",
  },
  {
    from: "#8e24aa", to: "#4a148c",
    icon: <GraduationCap size={18} strokeWidth={1.8} />,
    label: "Campus Print Shops",
  },
];

/* ── QR block (desktop) ── */
function QRBlock() {
  return (
    <div className="popup-qr-wrap_e">
      <div className="popup-qr-frame_e">
        <img src={QR_URL} alt="Scan to download" className="popup-qr-img_e"
          width={120} height={120} draggable={false} />
        <span className="popup-qr-c_e tl_e" />
        <span className="popup-qr-c_e tr_e" />
        <span className="popup-qr-c_e bl_e" />
        <span className="popup-qr-c_e br_e" />
      </div>
      <p className="popup-qr-hint_e">
        <ScanLine size={11} strokeWidth={2} />
        Scan to install on your phone
      </p>
    </div>
  );
}

/* ── Full Play Store screen ── */
function PhoneScreen({ isDesktop, onDownload, ready }) {
  return (
    <div className="popup-screen_e">
      <div className="popup-screen-glass_e" aria-hidden />

      {/* Punch-hole */}
      <div className="popup-camera-row_e" aria-hidden>
        <div className="popup-camera-hole_e" />
      </div>

      {/* Status bar */}
      <div className="popup-statusbar_e">
        <span className="popup-time_e">9:41</span>
        <div className="popup-status-icons_e">
          <Signal size={11} strokeWidth={2} />
          <Wifi   size={11} strokeWidth={2} />
          <BatteryFull size={13} strokeWidth={1.8} />
        </div>
      </div>

      {/* Play Store top bar */}
      <div className="popup-topbar_e">
        <ChevronLeft size={20} color="#202124" strokeWidth={2.2} />
        <span className="popup-topbar-title_e">Google Play</span>
        <MoreVertical size={18} color="#5f6368" strokeWidth={2} />
      </div>

      {/* ── Scrollable body ── */}
      <div className="popup-scroll_e">

        {/* App header */}
        <motion.div
          className="popup-app-header_e"
          initial={{ opacity: 0, y: 6 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.32, delay: 0.06, ease: EASE }}
        >
          <div className="popup-app-icon_e">
            <img src={LOGO} alt="Docuvio" draggable={false} />
          </div>
          <div className="popup-app-meta_e">
            <p className="popup-app-name_e">Docuvio</p>
            <p className="popup-app-dev_e">Docuvio</p>
            <p className="popup-app-contains_e">Contains ads · In-app purchases</p>
          </div>
        </motion.div>

        {/* Stats row — 4 columns like real Play Store */}
        <motion.div
          className="popup-stats_e"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.28, delay: 0.14, ease: EASE }}
        >
          {/* Rating */}
          <div className="popup-stat_e">
            <div className="popup-stat-value_e">
              4.8 <Star size={9} fill="#1a73e8" color="#1a73e8" />
            </div>
            <div className="popup-stat-label_e">
              2.1K <Info size={8} strokeWidth={2} />
            </div>
          </div>

          {/* Age rating */}
          <div className="popup-stat_e">
            <div className="popup-stat-value_e" style={{ fontSize: 10 }}>
              <span style={{
                border: "1.5px solid #5f6368", borderRadius: 3,
                padding: "1px 3px", fontSize: 9, fontWeight: 800, color: "#5f6368",
                lineHeight: 1,
              }}>3+</span>
            </div>
            <div className="popup-stat-label_e">Rated for</div>
          </div>

          {/* Size */}
          <div className="popup-stat_e">
            <div className="popup-stat-value_e">16 MB</div>
            <div className="popup-stat-label_e">
              <Download size={8} strokeWidth={2.5} />
            </div>
          </div>

          {/* Downloads */}
          <div className="popup-stat_e">
            <div className="popup-stat-value_e">10K+</div>
            <div className="popup-stat-label_e">Downloads</div>
          </div>
        </motion.div>

        {/* Install / QR */}
        <motion.div
          className="popup-install-wrap_e"
          initial={{ opacity: 0, y: 5 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
        >
          {isDesktop ? (
            <QRBlock />
          ) : (
            <button className="popup-install-btn_e" onClick={onDownload}>
              <Download size={14} strokeWidth={2.5} />
              Install
            </button>
          )}
        </motion.div>

        {/* Screenshot carousel */}
        <motion.div
          className="popup-screenshots_e"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.26, ease: EASE }}
        >
          {SCREENSHOTS.map((s, i) => (
            <div
              key={i}
              className="popup-screenshot_e"
              style={{ "--ss-from": s.from, "--ss-to": s.to }}
            >
              <div className="ss-icon_e">{s.icon}</div>
              <span className="ss-label_e">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* About section */}
        <motion.div
          className="popup-about_e"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.32, ease: EASE }}
        >
          <div className="popup-about-header_e">
            <p className="popup-about-title_e">About this app</p>
            <ChevronRight size={16} color="#5f6368" strokeWidth={2} />
          </div>
          <p className="popup-about-body_e">
            Upload documents, pick a campus print shop, pay securely and collect
            with a 4-digit OTP — no queues, no guesswork.
          </p>
          <div className="popup-chips_e">
            <span className="popup-chip_e">
              <Printer size={10} strokeWidth={2} /> Printing
            </span>
            <span className="popup-chip_e">
              <Package size={10} strokeWidth={2} /> Delivery
            </span>
            <span className="popup-chip_e">
              <GraduationCap size={10} strokeWidth={2} /> Campus
            </span>
          </div>

          {/* Ask Play row */}
          <div style={{
            marginTop: 12,
            padding: "8px 10px",
            background: "#f1f3f4",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <Sparkles size={12} color="#1a73e8" strokeWidth={2} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "#202124",
            }}>Ask Play about this app</span>
            <span style={{
              marginLeft: 2,
              fontSize: 8.5,
              fontWeight: 700,
              color: "#fff",
              background: "#34a853",
              borderRadius: 4,
              padding: "1px 5px",
              fontFamily: "'Inter', sans-serif",
            }}>New!</span>
          </div>
        </motion.div>

        {/* Bottom padding so content clears the nav */}
        <div style={{ height: 8, background: "#f8f9fa" }} />
      </div>

      {/* Bottom nav bar — Games / Apps / Search / Books */}
      <div className="popup-bottomnav_e">
        {[
          { icon: <Gamepad2 size={18} strokeWidth={1.8} />,   label: "Games" },
          { icon: <LayoutGrid size={18} strokeWidth={1.8} />, label: "Apps" },
          { icon: <Search size={18} strokeWidth={2} />,       label: "Search", active: true },
          { icon: <BookOpen size={18} strokeWidth={1.8} />,   label: "Books" },
        ].map((n, i) => (
          <div key={i} className={`popup-navitem_e${n.active ? " active_e" : ""}`}>
            {n.active && <span className="popup-nav-dot_e" />}
            {n.icon}
            <span className="popup-navlabel_e">{n.label}</span>
          </div>
        ))}
      </div>

      {/* Android gesture bar */}
      <div className="popup-gesturebar_e" aria-hidden />
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════ */
export default function AndroidAppPopup() {
  const [mode, setMode]       = useState("idle");
  const [dragPos, setDragPos] = useState(null);
  const [ready, setReady]     = useState(false);
  const isDesktop             = useIsDesktop();
  const phoneCtrl             = useAnimationControls();

  /* Auto-open after 8 seconds */
  useEffect(() => {
    const t = setTimeout(() => setMode("full"), 8000);
    return () => clearTimeout(t);
  }, []);

  /* Spring entrance only — no idle float */
  useEffect(() => {
    if (mode !== "full") { setReady(false); return; }
    let alive = true;
    setReady(false);
    phoneCtrl
      .start({
        opacity: 1, y: 0, rotateX: 0, scale: 1,
        transition: { type: "spring", stiffness: 260, damping: 24 },
      })
      .then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, [mode]);

  const minimize = () => setMode("mini");
  const expand   = () => setMode("full");
  const download = () => window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");

  const miniStyle = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y }
    : { position: "fixed", right: 20, bottom: 24 };

  return (
    <>
      {/* ═══════ FULL POPUP ═══════ */}
      <AnimatePresence>
        {mode === "full" && (
          <>
            <motion.div
              key="backdrop"
              className="popup-backdrop_e"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={minimize}
            />

            <div className="popup-center_e">
              <motion.div
                key="phone-wrap"
                className="popup-phone-wrap_e"
                style={{ perspective: "1100px" }}
                initial={{ opacity: 0, y: 80, rotateX: 14, scale: 0.9 }}
                animate={phoneCtrl}
                exit={{ opacity: 0, y: 60, scale: 0.92, transition: { duration: 0.22, ease: EASE } }}
              >
                <button className="popup-close_e" onClick={minimize} aria-label="Minimise">
                  <ChevronDown size={14} strokeWidth={2.5} />
                </button>

                <div className="popup-phone-glow_e" aria-hidden />

                <div className="popup-phone_e">
                  <span className="popup-btn_e volu_e"  aria-hidden />
                  <span className="popup-btn_e vold_e"  aria-hidden />
                  <span className="popup-btn_e power_e" aria-hidden />

                  <PhoneScreen
                    isDesktop={isDesktop}
                    onDownload={download}
                    ready={ready}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ MINI PILL ═══════ */}
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
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{   opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
            onTap={expand}
          >
            <span className="popup-mini-grip_e" aria-hidden>
              <GripHorizontal size={11} />
            </span>
            <span className="popup-mini-dot_e" aria-hidden />
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