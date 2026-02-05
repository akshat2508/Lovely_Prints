import "./admin.css";
import "./organisationAnalytics.css";
const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

import "./admin-theme.css"

const OrganisationAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="analytics-grid">
      <div className="stat-card">
        <div className="stat-value">{analytics.totalOrders}</div>
        <div className="stat-label">Total Orders</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">₹ {analytics.totalRevenue}</div>
        <div className="stat-label">Total Revenue</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{analytics.activeShops}</div>
        <div className="stat-label">Active Shops</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{analytics.closedShops}</div>
        <div className="stat-label">Closed Shops</div>
      </div>
    </div>
  );
};

export default OrganisationAnalytics;
