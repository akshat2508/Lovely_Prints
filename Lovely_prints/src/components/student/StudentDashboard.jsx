import logo from "../../assets/logo.png"
import "./dashboard.css"   // 👈 local dashboard CSS

const StudentDashboard = () => {
  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-left">
          <img src={logo} alt="Lovely Prints" className="dashboard-logo" />
          <span className="dashboard-title">Lovely Prints</span>
        </div>

        <div className="profile-circle">S</div>
      </header>

      {/* Content */}
      <main className="dashboard-content">

        {/* Quick Actions */}
        <section>
          <h2 className="section-heading">Quick Actions</h2>

          <div className="card-grid">
            <div className="dashboard-card">
              <h3>New Print Order</h3>
              <p>Upload documents & configure print options</p>
            </div>

            <div className="dashboard-card">
              <h3>Track Order</h3>
              <p>Check real-time order status</p>
            </div>

            <div className="dashboard-card">
              <h3>Order History</h3>
              <p>View previous orders & receipts</p>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 className="section-heading">Recent Orders</h2>
            <button className="new-order-btn">+ Place New Order</button>
          </div>

          <div className="order-card">
            <div>
              <strong>Order #LP1023</strong>
              <p className="status-progress">In Progress</p>
            </div>
            <span>₹45</span>
          </div>

          <div className="order-card">
            <div>
              <strong>Order #LP1018</strong>
              <p className="status-complete">Completed</p>
            </div>
            <span>₹30</span>
          </div>
        </section>

      </main>
    </div>
  )
}

export default StudentDashboard
