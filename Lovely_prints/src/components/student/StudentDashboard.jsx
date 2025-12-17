import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./dashboard.css"

const StudentDashboard = () => {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header1">
        <div className="dashboard-left1">
          <img src={logo} alt="Lovely Prints" className="dashboard-logo" />
          <span className="dashboard-title">Lovely Prints</span>
        </div>

        {/* Profile */}
        <div className="profile-wrapper">
          <div
            className="profile-circle1"
            onClick={() => setShowMenu(!showMenu)}
          >
            S
          </div>

          {showMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-content1">

        {/* Quick Actions */}
        <section>
          <h2 className="section-heading">Quick Actions</h2>

          <div className="card-grid1">
            <div className="dashboard-card1">
              <h3>New Print Order</h3>
              <p>Upload documents & configure print options</p>
            </div>

            <div className="dashboard-card1">
              <h3>Track Order</h3>
              <p>Check real-time order status</p>
            </div>

            <div className="dashboard-card1">
              <h3>Order History</h3>
              <p>View previous orders & receipts</p>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section style={{ marginTop: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h2 className="section-heading">Recent Orders</h2>
            <button className="new-order-btn">+ Place New Order</button>
          </div>

          <div className="order-card1">
            <div>
              <strong>Order #LP1023</strong>
              <p className="status-progress">In Progress</p>
            </div>
            <span>₹45</span>
          </div>

          <div className="order-card1">
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
