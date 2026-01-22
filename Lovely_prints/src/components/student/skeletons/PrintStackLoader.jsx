import "./printLoader.css";

const PrintStackLoader = ({ text = "Preparing your print order..." }) => {
  return (
    <div className="print-loader-overlay">
      <div className="print-loader">
        <div className="paper-stack">
          <div className="paper p1" />
          <div className="paper p2" />
          <div className="paper p3" />
          <div className="paper p4" />
        </div>

        <p className="loader-text">{text}</p>
        <p className="loader-subtext">Redirecting to secure payment…</p>
      </div>
    </div>
  );
};

export default PrintStackLoader;
