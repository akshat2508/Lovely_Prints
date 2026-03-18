import "./loggingOverlay.css";

export default function LoggingOutOverlay({ message = "Logging you out..." }) {
  return (
    <div className="lo-root">
      {/* Grid */}
      <div className="lo-grid" />

      {/* Blobs */}
      <div className="lo-blob lo-blob-1" />
      <div className="lo-blob lo-blob-2" />

      {/* Floating pills */}
      <div className="lo-pill lo-pill-1">Saving…</div>
      <div className="lo-pill lo-pill-2">Closing</div>

      {/* Center */}
      <div className="lo-center">
        <div className="lo-badge">
          <span className="lo-badge-dot" />
          SECURE LOGOUT
        </div>

        {/* Spinner */}
        <div className="lo-spinner" />

        <h2 className="lo-title">{message}</h2>
        <p className="lo-sub">Wrapping things up safely ✨</p>

        {/* Doc card (brand consistency) */}
        <div className="lo-doc-card">
          <div className="lo-doc-top">
            <span>📄</span>
            <div>
              <div className="lo-doc-name">session.docuvio</div>
              <div className="lo-doc-meta">Secured · Ending</div>
            </div>
          </div>
          <div className="lo-doc-status">● PROCESSING</div>
        </div>
      </div>
    </div>
  );
}