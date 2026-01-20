import "./Home.css";
import HeroVisual from "./HeroVisual";
import { useEffect, useState } from "react";

export default function Home() {
  const [showHeroVisual, setShowHeroVisual] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setShowHeroVisual(true);
    }
  }, []);

  useEffect(() => {
    if (showTeamPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTeamPopup]);

    const teamData = [
    {
      section: "Leadership",
      members: [
        {
          name: "Akshat",
          initials: "AK",
          role: "Project Lead",
          domain: "Platform Architecture",
          description: "Building systems that scale, one print at a time.",
          tags: ["System Design", "Operations", "Scalability"],
          linkedin: "https://linkedin.com/in/akshat-paul"
        }
      ]
    },
    {
      section: "Engineering",
      members: [
        {
          name: "Ayush",
          initials: "AY",
          role: "Frontend Engineer",
          domain: "Web Experience",
          description: "Great design is invisible, but great UX is unforgettable.",
          tags: ["React", "UI Systems", "Performance"],
          linkedin: "https://linkedin.com/in/ashmoneykash"
        },
        {
          name: "Anish",
          initials: "AN",
          role: "Mobile Engineer",
          domain: "Mobile Applications",
          description: "Making mobile experiences that just work, everywhere.",
          tags: ["Android", "iOS", "APIs"],
          linkedin: "https://linkedin.com/in/anish-randhawa21"
        }
      ]
    },
    {
      section: "Product",
      members: [
        {
          name: "Kashvi",
          initials: "KS",
          role: "Product Engineer",
          domain: "User Experience",
          description: "Every click should feel effortless, every flow intuitive.",
          tags: ["UX", "Product Strategy", "Research"],
          linkedin: "https://linkedin.com/in/kashvi-gulati"
        }
      ]
    }
  ];


  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Campus Printing Platform</div>

            <div className="hero-text">
              <h1>Print. Skip the chaos.</h1>
              <p>
                Upload your files, pick a shop, and collect prints—no running
                around.
              </p>
            </div>

            <div className="cta-group">
              <button className="btn primary">Upload now</button>
              <button className="btn secondary">I run a shop</button>
            </div>
          </div>

          <div className="hero-visual">
            {showHeroVisual && <HeroVisual />}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section-header">
          <span className="section-label">Process</span>
          <h2 className="section-title">How it works</h2>
        </div>

        <div className="steps">
          <article className="step-card" style={{ "--i": 0 }}>
            <div className="step-number">01</div>
            <h3>Upload</h3>
            <p>Upload your documents from anywhere.</p>
          </article>

          <article className="step-card" style={{ "--i": 1 }}>
            <div className="step-number">02</div>
            <h3>Select Shop</h3>
            <p>Pick a shop near you.</p>
          </article>

          <article className="step-card" style={{ "--i": 2 }}>
            <div className="step-number">03</div>
            <h3>Print</h3>
            <p>Shop gets your file and prints it.</p>
          </article>

          <article className="step-card" style={{ "--i": 3 }}>
            <div className="step-number">04</div>
            <h3>Collect</h3>
            <p>Collect when ready.</p>
          </article>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="audience">
        <div className="section-header">
          <span className="section-label">For Everyone</span>
          <h2 className="section-title">Who this helps</h2>
        </div>

        <div className="audience-grid">
          <article className="audience-card">
            <h3>Students</h3>
            <ul>
              <li>Skip the queue</li>
              <li>Upload from anywhere</li>
              <li>See prices, get prints faster</li>
            </ul>
          </article>

          <article className="audience-card">
            <h3>Print Shops</h3>
            <ul>
              <li>Manage all orders in one place</li>
              <li>Fewer walk-ins, less chaos</li>
              <li>Track every order clearly</li>
            </ul>
          </article>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div className="section-header">
          <span className="section-label">Advantages</span>
          <h2 className="section-title">Why this works</h2>
        </div>

        <div className="lifecycle-container">
          <svg className="lifecycle-curve" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(245, 130, 32, 0.15)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'rgba(245, 130, 32, 0.4)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(245, 130, 32, 0.15)', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              className="curve-path"
              d="M 0,60 Q 150,20 300,60 T 600,60 T 900,60 T 1200,60" 
              fill="none" 
              stroke="url(#curveGradient)" 
              strokeWidth="3"
              filter="url(#glow)"
            />
          </svg>

          <div className="lifecycle-stages">
            <div className="lifecycle-stage" style={{ '--delay': '0s' }}>
              <div className="stage-node">
                <div className="node-inner">
                  <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div className="node-ring"></div>
              </div>
              <div className="stage-content">
                <h3 className="stage-label">Upload</h3>
                <p className="stage-description">Files go to the cloud instantly</p>
              </div>
            </div>

            <div className="lifecycle-stage" style={{ '--delay': '0.15s' }}>
              <div className="stage-node">
                <div className="node-inner">
                  <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
                  </svg>
                </div>
                <div className="node-ring"></div>
              </div>
              <div className="stage-content">
                <h3 className="stage-label">Route to shop</h3>
                <p className="stage-description">System picks best available shop</p>
              </div>
            </div>

            <div className="lifecycle-stage" style={{ '--delay': '0.3s' }}>
              <div className="stage-node">
                <div className="node-inner">
                  <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </div>
                <div className="node-ring"></div>
              </div>
              <div className="stage-content">
                <h3 className="stage-label">Print</h3>
                <p className="stage-description">Shop receives and processes order</p>
              </div>
            </div>

            <div className="lifecycle-stage" style={{ '--delay': '0.45s' }}>
              <div className="stage-node">
                <div className="node-inner">
                  <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="node-ring"></div>
              </div>
              <div className="stage-content">
                <h3 className="stage-label">Ready</h3>
                <p className="stage-description">You get notified immediately</p>
              </div>
            </div>

            <div className="lifecycle-stage" style={{ '--delay': '0.6s' }}>
              <div className="stage-node">
                <div className="node-inner">
                  <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="node-ring"></div>
              </div>
              <div className="stage-content">
                <h3 className="stage-label">Collect</h3>
                <p className="stage-description">Pick up when convenient</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lifecycle-metric">
          <div className="metric-content">
            <span className="metric-label">Average time from upload to collection</span>
            <span className="metric-value">
              <span className="metric-number">Under 30</span>
              <span className="metric-unit">minutes</span>
            </span>
          </div>
          <div className="metric-visual">
            <svg viewBox="0 0 100 100" className="metric-circle">
              <circle cx="50" cy="50" r="45" className="metric-track"/>
              <circle cx="50" cy="50" r="45" className="metric-progress"/>
            </svg>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team">
        <div className="team-cta">
          <button 
            className="team-popup-trigger"
            onClick={() => setShowTeamPopup(true)}
            aria-label="View full team details"
          >
            <div className="team-trigger-content">
              <div className="team-trigger-avatars">
                <div className="team-trigger-avatar">AK</div>
                <div className="team-trigger-avatar">AY</div>
                <div className="team-trigger-avatar">AN</div>
                <div className="team-trigger-avatar">KS</div>
              </div>
              <div className="team-trigger-text">
                <span className="team-trigger-title">Meet the team</span>
                <span className="team-trigger-arrow">→</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* CLOSING */}
      <section className="closing">
        <div className="closing-visual">
          <div className="closing-ring closing-ring-1">
            <div className="orbit-icon orbit-icon-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="orbit-icon orbit-icon-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
          </div>
          <div className="closing-ring closing-ring-2">
            <div className="orbit-icon orbit-icon-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="orbit-icon orbit-icon-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="orbit-icon orbit-icon-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
          </div>
          <div className="closing-ring closing-ring-3">
            <div className="orbit-icon orbit-icon-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
              </svg>
            </div>
            <div className="orbit-icon orbit-icon-7">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
              </svg>
            </div>
            <div className="orbit-icon orbit-icon-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <circle cx="12" cy="15" r="2"/>
              </svg>
            </div>
          </div>
          <div className="closing-glow"></div>
        </div>
        <div className="closing-content">
          <h2>Start printing smarter</h2>
          <p>Made for students and campus print shops.</p>
        </div>
      </section>

      {/* TEAM POPUP */}
      {showTeamPopup && (
        <div className="team-popup-overlay" onClick={() => setShowTeamPopup(false)}>
          <div className="team-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="team-popup-header">
              <h2>Our Team</h2>
              <button 
                className="team-popup-close"
                onClick={() => setShowTeamPopup(false)}
                aria-label="Close team details"
              >
                ✕
              </button>
            </div>
            
            <div className="team-popup-body">
              {teamData.map((section, idx) => (
                <div key={idx} className="team-popup-section">
                  <h3 className="team-popup-section-title">{section.section}</h3>
                  <div className="team-popup-cards">
                    {section.members.map((member, mIdx) => (
                      <div key={mIdx} className="team-popup-card">
                        <div className="team-popup-card-header">
                          <div className="team-popup-avatar">{member.initials}</div>
                          <div className="team-popup-identity">
                            <h4>{member.name}</h4>
                            <span className="team-popup-role">{member.role}</span>
                          </div>
                        </div>
                        <div className="team-popup-card-body">
                          <div className="team-popup-domain">{member.domain}</div>
                          <p className="team-popup-description">{member.description}</p>
                          <div className="team-popup-tags">
                            {member.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="team-popup-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}