import React from 'react'
import "./admin.css";
import "./admin-theme.css"

const ShopAnalytics = ({ shop, analytics }) => {
  if (!shop) return null;

  return (
    <div className="shop-analytics">
      <h3>Shop: {shop.shop_name}</h3>

      {!analytics ? (
        <p>Loading shop analytics...</p>
      ) : (
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-value">{analytics.totalOrders}</div>
            <div className="stat-label">Shop Orders</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">₹ {analytics.totalRevenue}</div>
            <div className="stat-label">Shop Revenue</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopAnalytics;
