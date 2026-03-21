import { useEffect, useRef, useState } from "react";
import {
  motion, useScroll, useSpring, useTransform,
  useInView, AnimatePresence,
} from "framer-motion";
import "./Home.css";
import LOGO from "../assets/logo.png"
const EXPO = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, y = 28, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px 0px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EXPO }}>
      {children}
    </motion.div>
  );
}

const MODAL_CONTENT = {
  Privacy: {
    title: "Privacy Policy",
    body: `1. Docuvio collects only the data necessary to provide its services, including your email, uploaded documents, and order details.

2. Your documents are private and are only accessible to you and the selected print shop for the purpose of fulfilling your order. Documents are securely stored and automatically deleted within 24 hours after successful order completion.

3. We do not sell or share your personal data with third parties. Payment information is processed securely by third-party payment providers and is never stored on our servers.

4. While we implement reasonable security measures, no system is completely secure. By using Docuvio, you acknowledge this risk.`,
  },

  Terms: {
    title: "Terms of Service",
    body: `1. By using Docuvio, you agree to use the platform only for lawful purposes.

2. Docuvio acts solely as an intermediary between users and print shops. We do not provide printing services and are not responsible for print quality, delays, or errors made by print shops.

3. You are fully responsible for the content you upload. You must not upload illegal, harmful, or copyrighted material without proper authorization.

4. Orders, once placed, may not be cancelled or refunded unless explicitly stated by the print shop. Misuse of the platform may result in account suspension or termination.

5. We reserve the right to update these terms at any time with reasonable notice.`,
  },

  Contact: {
    title: "Contact Us",
    body: `Have a question or need support ?
    Contact us right away !!!

📧 support.docuvio@gmail.com
📍 Jalandhar, India
📞 +91 84930 12280 (primary)

Need specific help?

• Orders : +91 70510 45131  
• Tech : +91 95965 71744 `,
  },
};

function MacWindow({ modal, onClose }) {
  return (
    <AnimatePresence>
      {modal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="mac-backdrop_z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Window */}
          // REPLACE WITH:
          <div className="mac-center_z">
            <motion.div
              key="window"
              className="mac-window_z"
              initial={{ opacity: 0, scale: 0.82, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 32 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
            {/* Traffic lights */}
            <div className="mac-titlebar_z">
              <div className="mac-lights_z">
                <button className="mac-btn_z mac-close_z" onClick={onClose} title="Close" />
                <button className="mac-btn_z mac-min_z" title="Minimize" />
                <button className="mac-btn_z mac-max_z" title="Maximize" />
              </div>
              <span className="mac-win-title_z">{MODAL_CONTENT[modal]?.title}</span>
            </div>
            {/* Body */}
            <div className="mac-body_z">
              <h3 className="mac-h3_z">{MODAL_CONTENT[modal]?.title}</h3>
              <p className="mac-p_z">{MODAL_CONTENT[modal]?.body}</p>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Tag({ color, children }) {
  return (
    <div className="tag_z" style={{ color }}>
      <span className="tag-dot_z" style={{ background: color }} />
      {children}
    </div>
  );
}

const STAGES = [
  { id: "uploading", label: "Uploading", sub: "thesis_final_v3.pdf · 4.2 MB", icon: "⬆", color: "#BACDED", textColor: "#2a4a70", bg: "rgba(186,205,237,0.2)" },
  { id: "printing", label: "Printing", sub: "Block 38 · 12 pages · Color", icon: "⚙", color: "#FEC345", textColor: "#7a4f00", bg: "rgba(254,195,69,0.2)" },
  { id: "ready", label: "Ready for Pickup", sub: "OTP: 4829 · Pickup before 17:00", icon: "✓", color: "#8BAF29", textColor: "#3d5500", bg: "rgba(139,175,41,0.15)" },
];

function StatusAnimator() {
  const [idx, setIdx] = useState(0);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = (p + 1) % 101;
      setProg(p);
      if (p === 100) setIdx(i => (i + 1) % STAGES.length);
    }, 42);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="status-card_z">
      <div className="status-card-hdr_z">
        <span className="status-card-title_z">Order Tracker</span>
        <span className="status-file-pill_z">thesis_final_v3.pdf</span>
      </div>
      <div className="status-stages_z">
        {STAGES.map((s, i) => {
          const isActive = i === idx;
          const isDone = i < idx;
          return (
            <motion.div key={s.id}
              className="s-stage_z"
              animate={isActive
                ? { boxShadow: `0 0 0 2px ${s.color}`, background: s.bg }
                : { boxShadow: "none", background: "transparent" }}
              transition={{ duration: 0.4 }}>
              <div className="s-icon_z" style={{ background: isActive ? s.bg : "var(--parchment)" }}>
                <AnimatePresence mode="wait">
                  <motion.span key={isActive ? "active" : isDone ? "done" : "idle"}
                    initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.25 }}>
                    {isDone ? "✓" : isActive ? s.icon : "○"}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="s-info_z">
                <div className="s-name_z">{s.label}</div>
                <div className="s-sub_z">{s.sub}</div>
              </div>
              {isActive && (
                <motion.span className="s-badge_z"
                  style={{ background: s.bg, color: s.textColor }}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  Live
                </motion.span>
              )}
              {isDone && (
                <span className="s-badge_z" style={{ background: "rgba(139,175,41,0.15)", color: "#3d5500" }}>Done</span>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="prog-wrap_z">
        <div className="prog-labels_z">
          <span>{STAGES[idx].label}</span>
          <span>{prog}%</span>
        </div>
        <div className="prog-track_z">
          <div className="prog-fill_z" style={{ width: `${prog}%`, background: STAGES[idx].color, transition: "width 0.04s linear" }} />
        </div>
      </div>
    </div>
  );
}

function DashboardMock() {
  const [progVal, setProgVal] = useState(62);
  useEffect(() => {
    const iv = setInterval(() => setProgVal(v => v >= 98 ? 20 : v + 0.4), 80);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="dashboard-mock_z">
      <div className="mock-topbar_z">
        <span className="mock-dot_z r_z" /><span className="mock-dot_z y_z" /><span className="mock-dot_z g_z" />
        <div className="mock-url_z">Docuvio.app/dashboard</div>
      </div>
      <div className="mock-nav_z">
        <div className="mock-nav-brand_z">
          <img src={LOGO} alt="" className="mock-logo_z" />
          <span className="mock-name_z">Docuvio</span>
        </div>
        <div className="mock-tabs_z">
          <span className="mock-tab_z active_z">Home</span>
          <span className="mock-tab_z idle_z">Order</span>
          <span className="mock-tab_z gold_z">Profile</span>
        </div>
      </div>
      <div className="mock-body_z">
        <div className="mock-sidebar_z">
          <div className="mock-sb-title_z">Student Dashboard</div>
          <div className="mock-sb-sub_z">Your print journey</div>
          {[
            { label: "Choose Shop", active: false },
            { label: "Print Options", active: true },
            { label: "Upload & Pickup", active: false },
            { label: "Review Order", active: false },
            { label: "Orders", active: false },
          ].map(s => (
            <div key={s.label} className={`mock-step_z ${s.active ? "active_z" : ""}`}>
              <span className="mock-step-dot_z" />{s.label}
            </div>
          ))}
        </div>
        <div className="mock-main_z">
          <div className="mock-main-title_z">Block 38 (6th floor)</div>
          <div className="mock-shop-card_z">
            <div>
              <div className="mock-shop-name_z">Lovely Prints</div>
              <div className="mock-shop-meta_z">09:00 – 17:00 · A Block</div>
            </div>
            <span className="mock-open-badge_z">Open</span>
          </div>
          <div className="mock-opts_z">
            <div className="mock-opt_z"><div className="mock-opt-lbl_z">Paper</div><div className="mock-opt-val_z">A4</div></div>
            <div className="mock-opt_z"><div className="mock-opt-lbl_z">Color</div><div className="mock-opt-val_z">B&W ₹2</div></div>
            <div className="mock-opt_z"><div className="mock-opt-lbl_z">Copies</div><div className="mock-opt-val_z">2</div></div>
            <div className="mock-opt_z"><div className="mock-opt-lbl_z">Finish</div><div className="mock-opt-val_z">Normal</div></div>
          </div>
          <div className="mock-status-row_z">
            <span className="mock-status-label_z">Printing…</span>
            <div className="mock-prog_z">
              <div className="mock-prog-fill_z" style={{ width: `${progVal}%`, transition: "width 0.08s linear" }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--sage)", minWidth: 28 }}>{Math.round(progVal)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);

  // Track scroll for nav_z background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Set initial state
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -70]);
  const heroOp = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div>
      {/* Scroll progress bar */}
      <motion.div className="scroll-bar_z" style={{ scaleX }} />

      {/* ── NAV ──
          Key fix: we use a plain <nav> (not motion.nav) so Framer Motion
          never touches it. Background is toggled purely via inline style
          which always wins over CSS classes.
      */}
      <nav
        className="nav_z"
        style={{
          background: "rgba(245, 240, 232, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 1px 0 rgba(32,29,30,0.10), 0 4px 24px rgba(32,29,30,0.07)",
        }}
      >
        <a className="nav-brand_z" href="/">
          <img src={LOGO} alt="KaagaZ" className="nav-logo-img_z" />
          <span className="nav-brand-name_z">Docuvio</span>
        </a>
        <div className="nav-center_z">
          <a href="#how-it-works" className="nav-link_z">How it Works</a>
          <a href="#features" className="nav-link_z">Features</a>
          <a href="#for-shops" className="nav-link_z">For Shops</a>
        </div>
        <div className="nav-right_z">
          <a href="/login" className="btn-nav-login_z">Log In</a>
          <div className="nav-divider_z" />
          <a href="/signup" className="btn-nav-register_z">Register →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero_z">
        <div className="hero-grid-bg_z" />
        <motion.div className="hero-left_z" style={{ y: heroY, opacity: heroOp }}>
          <Reveal delay={0.15}>
            <div className="hero-pill_z">
              <span className="hero-pill-dot_z" />
              Campus Printing Marketplace
            </div>
          </Reveal>
          <Reveal delay={0.28} y={52}>
            <div className="hero-h1_z">Print <span className="hero-h1-accent_z">Smarter.</span></div>
            <div className="hero-h1-outline_z">Move Faster.</div>
          </Reveal>
          <Reveal delay={0.42}>
            <p className="hero-desc_z">
              Docuvio connects students to campus print shops —{" "}
              <strong>upload, configure, pay, and pick up.</strong> No queues. No guesswork. Just your document, done.
            </p>
          </Reveal>
          <Reveal delay={0.54}>
            <div className="hero-btns_z">
              <a href="/signup" className="btn-hero-sage_z">Start Printing →</a>
              <a href="/login" className="btn-hero-gold_z">Log In</a>
            </div>
          </Reveal>
          <Reveal delay={0.66}>
            <div className="hero-stats_z">
              <div className="stat-item_z"><span className="stat-val_z">40+</span><span className="stat-lbl_z">Print Shops</span></div>
              <div className="stat-item_z"><span className="stat-val_z">2 min</span><span className="stat-lbl_z">Avg. Order</span></div>
              <div className="stat-item_z"><span className="stat-val_z">₹2</span><span className="stat-lbl_z">Starting Price</span></div>
            </div>
          </Reveal>
        </motion.div>

        <div className="hero-right_z">
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: EXPO }}
            style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 2 }}>
            <DashboardMock />
          </motion.div>

          <motion.div className="float-card_z" style={{ top: "12%", left: "2%" }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: EXPO }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <div className="float-card-title_z">📄 Lab Report</div>
              <div className="float-card-sub_z">12 pages · Color</div>
              <span className="float-badge_z badge-sage_z">✓ Ready</span>
            </motion.div>
          </motion.div>

          <motion.div className="float-card_z" style={{ bottom: "22%", left: "0%" }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EXPO }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
              <div className="float-card-title_z">⏰ Pickup · Today</div>
              <div className="float-card-sub_z">11:30 · Block 38</div>
              <span className="float-badge_z badge-gold_z">⚙ Printing</span>
            </motion.div>
          </motion.div>

          <motion.div className="float-card_z" style={{ top: "52%", right: "0%" }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: EXPO }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
              <div className="float-card-title_z">💳 ₹24 paid</div>
              <div className="float-card-sub_z">Secure · Instant</div>
              <span className="float-badge_z badge-sage_z">✓ Confirmed</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-strip_z">
        <div className="ticker-label-wrap_z">
          <span className="ticker-label_z">Live Orders</span>
        </div>
        <div className="ticker-track_z">
          <motion.div className="ticker-inner_z"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
            {[
              { icon: "📄", text: "Thesis · Block 38", cls: "t-sage_z", status: "Ready" },
              { icon: "📘", text: "Assignment · Block 12", cls: "t-gold_z", status: "Printing" },
              { icon: "🧪", text: "Lab Report · Block 6", cls: "t-coral_z", status: "Uploading" },
              { icon: "📝", text: "Case Study · Block 22", cls: "t-sage_z", status: "Ready" },
              { icon: "📊", text: "Presentation · Block 4", cls: "t-gold_z", status: "Printing" },
              { icon: "📑", text: "CV · Block 9", cls: "t-sage_z", status: "Ready" },
              { icon: "📄", text: "Thesis · Block 38", cls: "t-sage_z", status: "Ready" },
              { icon: "📘", text: "Assignment · Block 12", cls: "t-gold_z", status: "Printing" },
              { icon: "🧪", text: "Lab Report · Block 6", cls: "t-coral_z", status: "Uploading" },
              { icon: "📝", text: "Case Study · Block 22", cls: "t-sage_z", status: "Ready" },
              { icon: "📊", text: "Presentation · Block 4", cls: "t-gold_z", status: "Printing" },
              { icon: "📑", text: "CV · Block 9", cls: "t-sage_z", status: "Ready" },
            ].map((t, i) => (
              <span key={i} className="ticker-item_z">
                {t.icon} {t.text} · <span className={t.cls}>{t.status}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="hiw-section_z" id="how-it-works">
        <div className="hiw-top_z">
          <Reveal>
            <Tag color="var(--sage)">How it Works</Tag>
            <h2 className="h2_z">Four steps.<br />Zero friction.</h2>
            <p className="lead_z">From upload to pickup — the entire campus printing experience, redesigned from scratch.</p>
          </Reveal>
        </div>
        <div className="hiw-grid_z">
          {[
            { num: "01", numCol: "#BACDED", iconBg: "rgba(186,205,237,0.3)", icon: "📂", title: "Choose a Print Shop", desc: "Browse all campus shops filtered by open status, block location, and rating. See real-time availability before placing an order.", chips: ["All · Open · Closed", "Map View", "Block Filter"] },
            { num: "02", numCol: "#FEC345", iconBg: "rgba(254,195,69,0.25)", icon: "⚙", title: "Configure Print Settings", desc: "Select paper type, color mode, finish, orientation, copies, and page range. Your preferences saved for next time.", chips: ["A4 · Bond", "B&W · Color · CV", "Normal Finish"] },
            { num: "03", numCol: "#8BAF29", iconBg: "rgba(139,175,41,0.15)", icon: "⬆", title: "Upload & Schedule Pickup", desc: "Upload your file and pick a timeslot — Today or Tomorrow, in 30-min windows. Add urgent flag (+₹10) for priority.", chips: ["PDF · DOCX · Any", "Today / Tomorrow", "Urgent +₹10"] },
            { num: "04", numCol: "#E57373", iconBg: "rgba(229,115,115,0.15)", icon: "📦", title: "Review, Pay & Collect", desc: "Confirm your order summary, pay securely in-app, and get an OTP. Walk in at your timeslot, show OTP, walk out.", chips: ["Order Summary", "Secure Pay", "OTP Pickup"] },
          ].map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <div className="hiw-step_z">
                <div className="step-num_z" style={{ color: s.numCol, opacity: 0.4 }}>{s.num}</div>
                <div className="step-icon-box_z" style={{ background: s.iconBg }}>{s.icon}</div>
                <div className="step-title_z">{s.title}</div>
                <p className="step-desc_z">{s.desc}</p>
                <div className="step-chips_z">
                  {s.chips.map(c => (
                    <span key={c} className="s-chip_z" style={{ background: s.iconBg, color: "var(--ink-70)" }}>{c}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── STATUS ANIMATION ── */}
      <section className="status-section_z">
        <div className="status-inner_z">
          <Reveal>
            <Tag color="var(--gold-dark)">Real-time Tracking</Tag>
            <h2 className="h2_z">Watch your order<br /><em style={{ color: "var(--sage)", fontStyle: "normal" }}>come to life.</em></h2>
            <p className="lead_z" style={{ marginTop: 16 }}>
              Every print job moves through three clear stages. No calling the shop. No waiting at the counter. Pure clarity.
            </p>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📍", text: "Block 38, 6th Floor — Open until 17:00" },
                { icon: "🔔", text: "Push & SMS notifications at every stage" },
                { icon: "🔑", text: "4-digit OTP for secure, no-queue pickup" },
              ].map(f => (
                <div key={f.icon} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 300, color: "var(--ink-70)" }}>{f.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <StatusAnimator />
          </Reveal>
        </div>
      </section>

      {/* ── PERSONA ── */}
      <section className="persona-section_z" id="for-shops">
        <div className="persona-inner_z">
          <Reveal>
            <Tag color="var(--coral)">Who It's For</Tag>
            <h2 className="h2_z">Two sides.<br />One platform.</h2>
            <p className="lead_z" style={{ marginTop: 16 }}>
              Docuvio is built for students who need fast prints, and shop owners who need a professional digital operations layer.
            </p>
          </Reveal>
          <div className="persona-grid_z">
            <Reveal delay={0.1}>
              <div className="p-card_z p-ink_z">
                <div className="p-bg-shape_z" />
                <div className="p-tag_z">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage)", display: "inline-block" }} />
                  For Students
                </div>
                <h3 className="p-h3_z">Skip the queue.<br />Print on demand.</h3>
                <p className="p-body_z">Upload any document from your phone or laptop, choose a nearby open shop, and schedule a pickup that fits your timetable.</p>
                <ul className="p-list_z">
                  {["Upload any format — PDF, DOCX, PPT", "Browse shops by block & open status", "Configure paper, color, binding, copies", "Pay securely in-app — no cash needed", "OTP-based pickup — no waiting at counter"].map(l => (
                    <li key={l}><span className="p-dot_z" />{l}</li>
                  ))}
                </ul>
                <a href="/signup" className="p-action_z">Get Started as Student →</a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="p-card_z p-yellow_z">
                <div className="p-bg-shape_z" />
                <div className="p-tag_z">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
                  For Print Shop Owners
                </div>
                <h3 className="p-h3_z">Your digital storefront. Zero overhead.</h3>
                <p className="p-body_z">Get discovered by students across campus. Manage your order queue digitally, reduce miscommunication, and track revenue in real time.</p>
                <ul className="p-list_z">
                  {["Smart order management dashboard", "Set your own hours, capacity & pricing", "View orders: Paper type, color, pages", "Instant payout on order completion", "Analytics on peak hours and demand"].map(l => (
                    <li key={l}><span className="p-dot_z" />{l}</li>
                  ))}
                </ul>
                <a href="/signup?role=shop" className="p-action_z">Get Started →</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="feat-section_z" id="features">
        <div className="feat-inner_z">
          <Reveal>
            <Tag color="#7A9EC0">Why Docuvio</Tag>
            <h2 className="h2_z">Everything<br />engineered for campus.</h2>
          </Reveal>
          <div className="feat-grid_z">
            {[
              { icon: "⚡", bg: "rgba(254,195,69,0.2)", title: "Instant Uploads", desc: "Files are processed and queued to your chosen shop in seconds. PDF, DOCX, PPT — any format handled." },
              { icon: "🗺", bg: "rgba(186,205,237,0.3)", title: "Campus Map View", desc: "See every print shop on campus with live open/closed status. Filter by block, rating, and service type." },
              { icon: "🔔", bg: "rgba(139,175,41,0.15)", title: "Live Order Tracking", desc: "Real-time SMS and in-app push notifications at every status change — Uploading → Printing → Ready." },
              { icon: "💳", bg: "rgba(229,115,115,0.15)", title: "Secure Payments", desc: "End-to-end encrypted in-app payment. Supports UPI, cards, and wallets. No cash exchange at the counter." },
              { icon: "📊", bg: "rgba(254,195,69,0.15)", title: "Shop Analytics", desc: "Owners get demand forecasts, peak-hour insights, top products, and daily revenue summaries in one dashboard." },
              { icon: "🔒", bg: "rgba(32,29,30,0.06)", title: "Privacy-First", desc: "Your documents are encrypted at rest and automatically deleted 24 hours after successful pickup." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="f-cell_z">
                  <div className="f-icon_z" style={{ background: f.bg }}>{f.icon}</div>
                  <div className="f-title_z">{f.title}</div>
                  <p className="f-desc_z">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="proof-section_z">
        <div className="proof-inner_z">
          <Reveal>
            <Tag color="var(--sage)">Early Access</Tag>
            <h2 className="h2_z">Students already<br /><em style={{ fontStyle: "normal", color: "var(--coral)" }}>love it.</em></h2>
          </Reveal>
          <div className="proof-grid_z">
            {[
              { q: "I used to miss morning lectures just waiting at the photocopy shop. With Docuvio, I upload the night before and pick it up between classes.", name: "Priya S.", meta: "3rd Year · CSE", av: "P", avCol: "#8BAF29" },
              { q: "As a shop owner, managing 50+ orders on paper was chaos. The dashboard shows me everything — pending, printing, done. It's changed how I work.", name: "Ramesh K.", meta: "Owner · Block 38", av: "R", avCol: "#DF9A06" },
              { q: "The OTP pickup system is genius. No miscommunication, no wrong orders given out. My shop's error rate dropped to nearly zero.", name: "Anjali M.", meta: "Owner · Block 12", av: "A", avCol: "#E57373" },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <div className="proof-card_z">
                  <div className="proof-stars_z">★★★★★</div>
                  <p className="proof-quote_z">{p.q}</p>
                  <div className="proof-author_z">
                    <div className="proof-av_z" style={{ background: p.avCol }}>{p.av}</div>
                    <div>
                      <div className="proof-nm_z">{p.name}</div>
                      <div className="proof-mt_z">{p.meta}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-wrap_z">
        <Reveal y={24}>
          <div className="cta-block_z">
            <div className="cta-glow_z" />
            <div className="cta-grid-bg_z" />
            {[
              { text: "📄 thesis_final.pdf · Ready", x: "4%", y: "18%", bg: "rgba(139,175,41,0.2)", border: "rgba(139,175,41,0.3)", color: "#4a6500", delay: 0.5 },
              { text: "⚙ Assignment printing…", x: "72%", y: "72%", bg: "rgba(254,195,69,0.12)", border: "rgba(254,195,69,0.22)", color: "rgba(245,240,232,0.5)", delay: 1 },
              { text: "📦 OTP: 4829 · Ready", x: "68%", y: "14%", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", color: "rgba(245,240,232,0.4)", delay: 1.4 },
            ].map((c, i) => (
              <motion.div key={i} className="cta-ambient_z"
                style={{ left: c.x, top: c.y, background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ delay: c.delay, opacity: { duration: 0.5 }, y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" } }}>
                {c.text}
              </motion.div>
            ))}
            <div className="cta-tag_z">Join the Waitlist</div>
            <h2 className="cta-h2_z">
              The future of campus<br />
              printing is <span className="cta-gold_z">fast</span>,{" "}
              <span className="cta-sage_z">smart</span> &amp; now.
            </h2>
            <p className="cta-sub_z">
              We're onboarding universities and print shops across Delhi. Be among the first to experience frictionless campus printing.
            </p>
            <div className="cta-btns_z">
              <a href="/signup" className="btn-cta-gold_z">Register as Student →</a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer_z">
        <div className="footer-brand-row_z">
          <img src={LOGO} alt="KaagaZ" className="footer-logo_z" />
          <span className="footer-nm_z">Docuvio</span>
          <span className="footer-copy_z">© 2026. All rights reserved.</span>
        </div>
        <ul className="footer-links_z">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <li key={item}>
              <button
                className="footer-modal-btn_z"
                onClick={() => setModal(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </footer>

      <MacWindow modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}