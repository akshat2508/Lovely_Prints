import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import "./dashboard.css"

const StudentDashboard = () => {
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")

  // ✅ Static orders (for now)
  const orders = [
    {
      id: "LP1023",
      price: 45,
      status: "progress",
      timeline: ["Uploaded", "Accepted", "Printing"],
    },
    {
      id: "LP1018",
      price: 30,
      status: "completed",
      timeline: ["Uploaded", "Accepted", "Printing", "Ready", "Completed"],
    },
  ]

  // ✅ Filter logic
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter)

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
              <button onClick={() => navigate("/login")}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content1">

        {/* Top Actions Row */}
<div className="top-actions-row">
  <button
    className="create-order-btn"
    onClick={() => setShowModal(true)}
  >
    + Create New Print Order
  </button>

  <div className="order-filters">
    <button
      className={filter === "all" ? "active-filter" : ""}
      onClick={() => setFilter("all")}
    >
      All
    </button>
    <button
      className={filter === "progress" ? "active-filter" : ""}
      onClick={() => setFilter("progress")}
    >
      In Progress
    </button>
    <button
      className={filter === "completed" ? "active-filter" : ""}
      onClick={() => setFilter("completed")}
    >
      Completed
    </button>
  </div>
</div>

        {/* Orders */}
        <section className="orders-section">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card1">
              <div>
                <strong>Order #{order.id}</strong>

                <div className="status-timeline">
                  {["Uploaded", "Accepted", "Printing", "Ready", "Completed"].map(
                    (step) => (
                      <span
                        key={step}
                        className={
                          order.timeline.includes(step)
                            ? step === "Printing" && order.status === "progress"
                              ? "active"
                              : "done"
                            : ""
                        }
                      >
                        {step}
                      </span>
                    )
                  )}
                </div>
              </div>

              <span>₹{order.price}</span>
            </div>
          ))}
        </section>

      </main>

      {/* MODAL (UNCHANGED) */}
      {showModal && (
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

            <input className="modal-input" placeholder="Number of Copies" />

            <select className="modal-input">
              <option>Orientation</option>
              <option>Portrait</option>
              <option>Landscape</option>
            </select>

            <select className="modal-input">
              <option>Urgency</option>
              <option>Normal</option>
              <option>High (+ ₹10)</option>
            </select>

            <label className="upload-field">
              📄 Upload Document
              <input type="file" hidden />
            </label>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="modal-submit">Submit Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
