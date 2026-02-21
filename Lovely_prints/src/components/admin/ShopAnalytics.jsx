import "./organisationAnalytics.css";

const ShopAnalytics = ({ shop, analytics }) => {
  if (!shop) return null;

  if (!analytics) {
    return (
      <div className="shop-metrics-A">
        <div className="metric-card-A skeleton-A" />
        <div className="metric-card-A skeleton-A" />
      </div>
    );
  }

  return (
    <div className="shop-analytics-section-A">

      <div className="shop-context-header-A">
        <div>
          <div className="shop-context-label-A">Shop Overview</div>
          <h3 className="shop-context-title-A">{shop.shop_name}</h3>
        </div>

        <div className={`shop-context-status-A ${shop.is_active ? "open" : "closed"}`}>
          {shop.is_active ? "Open" : "Closed"}
        </div>
      </div>

      <div className="shop-metrics-A">
        <div className="metric-card-A orders-A">
          <div className="metric-label-A">Shop Orders</div>
          <div className="metric-value-A">{analytics.totalOrders}</div>
        </div>

        <div className="metric-card-A  revenue-A">
          <div className="metric-label-A">Shop Revenue</div>
          <div className="metric-value-A">₹ {analytics.totalRevenue}</div>
        </div>
      </div>

    </div>
  );
};

export default ShopAnalytics;