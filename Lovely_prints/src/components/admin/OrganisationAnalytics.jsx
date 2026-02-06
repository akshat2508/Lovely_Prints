import "./admin.css";
import "./organisationAnalytics.css";
import "./admin-theme.css"

const OrganisationAnalytics = ({ analytics }) => {

  if (!analytics) {
  return (
    <div className="analytics-grid">
      {[1,2,3,4].map(i => (
        <div key={i} className="stat-card skeleton stat-skeleton" />
      ))}
    </div>
  );
}

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
