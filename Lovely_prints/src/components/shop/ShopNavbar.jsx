import "./shopNavbar.css";
import logo from "../../assets/logo.png";

const ShopNavbar = ({
  shop,
  isUpdating,
  onToggleShop,
  onLogout,
  activeTab,
  setActiveTab,
  hasNewOrders,
  hasUrgentOrders,
}) => {
  return (
    <nav className="shop-navbar">
      <div className="shop-navbar-inner">
        {/* LEFT */}
        <div className="nav-left">
          <img src={logo} alt="Lovely Prints" className="nav-logo" />
          <span className="nav-title">{shop?.shop_name || "My Shop"}</span>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
            {hasNewOrders && (
              <span
                className={`nav-notification ${
                  hasUrgentOrders ? "urgent" : ""
                }`}
              >
                {hasUrgentOrders ? "URGENT" : "NEW"}
              </span>
            )}
          </button>

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Pricing
          </button>

          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <div className="shop-toggle">
            <span className={!shop?.is_active ? "muted" : ""}>Closed</span>

            <label className="switch">
              <input
                type="checkbox"
                checked={shop?.is_active}
                disabled={isUpdating}
                onChange={onToggleShop}
              />
              <span className="slider" />
            </label>

            <span className={shop?.is_active ? "active" : "muted"}>Open</span>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ShopNavbar;
