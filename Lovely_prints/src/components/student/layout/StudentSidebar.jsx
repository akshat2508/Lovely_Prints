import { useStudentData } from "../context/StudentDataContext";
import "./StudentSidebar.css";
import { useEffect, useState } from "react";

const StudentSidebar = () => {
  const { flowStage } = useStudentData();

  const steps = [
    { id: 1, title: "Choose Shop", subtitle: "Select a print shop" },
    { id: 2, title: "Print Options", subtitle: "Configure your print" },
    { id: 3, title: "Upload & Pickup", subtitle: "Schedule pickup time" },
    { id: 4, title: "Review Order", subtitle: "Confirm & pay" },
    { id: 5, title: "Orders", subtitle: "Track & collect" },
  ];
const tips = [
  "Choose nearby shops for faster prints",
  "Double-check page orientation before uploading",
  "Bulk prints may get discounted pricing",
  "Upload PDFs for best formatting results",
  "Urgent orders close before shop closing time"
];

const [tipIndex, setTipIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="student-sidebar-inner">
      {/* Header */}
      <div className="sidebar-header">
        <h2>Student Dashboard</h2>
        <p>Your print journey</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {steps.map((step) => {
          const isCompleted = flowStage > step.id;
          const isActive = flowStage === step.id;

          return (
            <div
              key={step.id}
              className={`sidebar-item 
                ${isActive ? "active" : ""} 
                ${isCompleted ? "completed" : ""}
                ${flowStage < step.id ? "muted" : ""}
              `}
            >
              <span className="sidebar-dot" />

              <div className="sidebar-text">
                <strong>{step.title}</strong>
                <small>{step.subtitle}</small>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
     <div className="sidebar-footer">
  <div className="sidebar-tip">
    💡 Tip
    <div className="tip-slider">
      <div
        className="tip-track"
        style={{ transform: `translateX(-${tipIndex * 100}%)` }}
      >
        {tips.map((tip, index) => (
          <span key={index} className="tip-item">
            {tip}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default StudentSidebar;
