import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./dashboard.css"

const StudentDashboard = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [filter, setFilter] = useState("All")

  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  /* ✅ Orders with STATUS TAGS */
  const orders = [
    {
      id: "LP1023",
      status: "In Progress",
      price: 45
    },
    {
      id: "LP1018",
      status: "Completed",
      price: 30
    }
  ]

  /* ✅ Filter based on tags */
  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true
    return order.status === filter
  })

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header1">
        <div className="dashboard-left1">
          <img src={logo} alt="Lovely Prints" className="dashboard-logo" />
          <span className="dashboard-title">Lovely Prints</span>
        </div>

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

        {/* Top Actions */}
        <div className="top-actions">
          <button
            className="new-order-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Print Order
          </button>

          <div className="filters">
            {["All", "In Progress", "Completed"].map(item => (
              <button
                key={item}
                className={`filter-btn ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <h2 className="section-heading">Recent Orders</h2>

        {filteredOrders.length === 0 && (
          <p style={{ color: "#777" }}>No orders found.</p>
        )}

        {filteredOrders.map(order => (
          <div className="order-card1" key={order.id}>
            <div>
              <strong>Order #{order.id}</strong>
              <p
                className={
                  order.status === "Completed"
                    ? "status-complete"
                    : "status-progress"
                }
              >
                {order.status}
              </p>
            </div>

            <div className="order-actions">
              <span className="order-price">₹{order.price}</span>

              {order.status !== "Completed" && (
                <button
                  className="track-btn"
                  onClick={() => setShowTrackModal(true)}
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        ))}

      </main>

      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Create Print Order</h2>

            <select className="modal-input">
              <option>Select Shop Location</option>
              <option>Block 27</option>
              <option>Block 38</option>
              <option>UniMall</option>
            </select>

            <select className="modal-input">
              <option>Paper Type</option>
              <option>A4</option>
              <option>Bond Paper</option>
              <option>Passport Size</option>
            </select>

            <input
              type="number"
              className="modal-input"
              placeholder="Number of Copies"
            />

            <select className="modal-input">
              <option>Orientation</option>
              <option>Portrait</option>
              <option>Landscape</option>
            </select>

            <select className="modal-input">
              <option>Urgency</option>
              <option>Normal</option>
              <option>High (+₹10)</option>
            </select>

            <label className="upload-box">
              📄 Upload Document
              <input type="file" hidden />
            </label>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="submit-btn">Submit Order</button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK ORDER MODAL */}
      {showTrackModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Track Order #LP1023</h2>

            <div className="timeline">
              <div className="timeline-item completed">
                <span className="timeline-dot"></span>
                <span className="timeline-text">Uploaded</span>
              </div>
              <div className="timeline-item completed">
                <span className="timeline-dot"></span>
                <span className="timeline-text">Accepted by Shop</span>
              </div>
              <div className="timeline-item active">
                <span className="timeline-dot"></span>
                <span className="timeline-text">Printing</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot"></span>
                <span className="timeline-text">Ready for Pickup</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot"></span>
                <span className="timeline-text">Completed</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowTrackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default StudentDashboard
