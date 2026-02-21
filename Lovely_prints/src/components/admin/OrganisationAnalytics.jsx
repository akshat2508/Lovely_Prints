import "./organisationAnalytics.css";

const OrganisationAnalytics = ({ analytics, onRevenueClick , revenueCalculated}) => {
  if (!analytics) {
    return (
      <div className="analytics-grid-A">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="metric-card-A skeleton" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: analytics.totalOrders,
      variant: "orders",
    },
    {
      label: "Total Revenue",
      value:
  revenueCalculated
    ? `₹ ${Number(analytics.totalRevenue || 0).toLocaleString("en-IN")}`
    : "Click to calculate",
      variant: "revenue",
      clickable: true,
    },
    {
      label: "Active Shops",
      value: analytics.activeShops,
      variant: "active",
    },
    {
      label: "Closed Shops",
      value: analytics.closedShops,
      variant: "closed",
    },
  ];

  return (
    <div className="analytics-grid-A">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`metric-card-A ${card.variant} ${
            card.clickable ? "clickable-card-A" : ""
          }`}
          onClick={card.clickable ? onRevenueClick : undefined}
        >
          <div className="metric-label-A">{card.label}</div>
          <div className="metric-value-A">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default OrganisationAnalytics;