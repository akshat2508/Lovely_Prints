import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./organisationAnalytics.css";

const OrganisationTrends = ({ ordersByDate, revenueByDate }) => {
  if (!ordersByDate || !revenueByDate) {
    return (
      <div className="trends-grid-A">
        <div className="trend-card-A skeleton-A" />
        <div className="trend-card-A skeleton-A" />
      </div>
    );
  }

  return (
    <div className="trends-section-A">
      <div className="section-header-A">
        <h3>Organisation Trends</h3>
      </div>

      <div className="trends-grid-A">
        {/* Orders Trend */}
        <div className="trend-card-A">
          <div className="trend-title-A">Orders Over Time</div>
          <div className="trend-chart-A">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersByDate}>
                <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8AB62D"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="trend-card-A">
          <div className="trend-title-A">Revenue Over Time</div>
          <div className="trend-chart-A">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDate}>
                <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#DF9A06"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationTrends;