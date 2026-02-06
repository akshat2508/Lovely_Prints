import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./admin.css"
import "./admin-theme.css"
const OrganisationTrends = ({ ordersByDate, revenueByDate }) => {
if (!ordersByDate || !revenueByDate) {
  return (
    <div>
      <div className="skeleton chart-skeleton" />
      <div className="skeleton chart-skeleton" />
    </div>
  );
}

  return (
    <div className="trends-container">
      <h3>Organisation Trends</h3>

      {/* Orders Trend */}
      <div className="trend-card" >
        <h4>Orders Over Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ordersByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Trend */}
      <div className="trend-card" >
        <h4>Revenue Over Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrganisationTrends;
