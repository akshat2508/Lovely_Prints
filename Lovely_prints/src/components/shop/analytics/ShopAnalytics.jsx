import { calculateStats, groupSalesByHour } from "./analyticsUtils";
import SalesChart from "./SalesChart";
import StatsCard from "./StatsCard";
import "./shopAnalytics.css";

export default function ShopAnalytics({ orders }) {
  const stats = calculateStats(orders);
  const chartData = groupSalesByHour(orders);

  const hasSales = stats.totalRevenue > 0;

  if (!hasSales) {
    return (
      <div className="analytics-empty">
        <h2>No sales today</h2>
        <p>Once customers place paid orders, analytics will appear here.</p>
      </div>
    );
  }
  const peakHour = chartData.reduce(
    (max, curr) => (curr.amount > max.amount ? curr : max),
    chartData[0],
  );

  return (
    <div className="analytics-page">
      <div className="stats-grid">
        <StatsCard label="Revenue Today" value={`₹${stats.totalRevenue}`} />
        <StatsCard label="Paid Orders" value={stats.paidOrders} />
        <StatsCard label="Completed" value={stats.completed} />
        <StatsCard
          label="Peak Hour"
          value={`${peakHour.hour} (₹${peakHour.amount})`}
        />
      </div>

      <div className="chart-card">
        <h3>Hourly Sales</h3>
        <SalesChart data={chartData} />
      </div>
    </div>
  );
}
