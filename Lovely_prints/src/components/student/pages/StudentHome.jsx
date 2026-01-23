import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import ShopSkeleton from "../skeletons/ShopSkeleton";
import ShopFallBack from "../assets/shop1.jpg";
import OpenPoliciesModal from "../modals/OpenPoliciesModal";

import "./studentHome.css";

const StudentHome = () => {
  const navigate = useNavigate();
  const { shops, shopsLoading, fetchShops } = useStudentData();
  const [shopStatusFilter, setShopStatusFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [showPolicies, setShowPolicies] = useState(true);

  // useEffect(() => {
  //   fetchShops();
  // }, []);
  const handleAcceptPolicies = () => {
  setShowPolicies(false);
};


  useEffect(() => {
    if (!shops) return;

    const filtered = shops.filter((shop) => {
  const matchesSearch =
    shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.block.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    shopStatusFilter === "all" ||
    (shopStatusFilter === "open" && shop.is_active) ||
    (shopStatusFilter === "closed" && !shop.is_active);

  return matchesSearch && matchesStatus;
});


    setFilteredShops(filtered);
  }, [searchTerm, shops, shopStatusFilter]);


  if (shopsLoading) {
    return (
      <div className="student-home">
        <h1 className="student-home-title">Choose a Print Shop</h1>
        <div className="shop-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShopSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="student-home">
      {showPolicies && <OpenPoliciesModal onAccept={handleAcceptPolicies} />}

      <h1 className="student-home-title">Choose a Print Shop</h1>

      {/* Search */}
      <div className="shop-search-A">
        <input
          type="text"
          placeholder="Search by shop name or block..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="shop-filter-A">
  <button
    className={shopStatusFilter === "all" ? "active" : ""}
    onClick={() => setShopStatusFilter("all")}
  >
    All
  </button>

  <button
    className={shopStatusFilter === "open" ? "active" : ""}
    onClick={() => setShopStatusFilter("open")}
  >
    Open
  </button>

  <button
    className={shopStatusFilter === "closed" ? "active" : ""}
    onClick={() => setShopStatusFilter("closed")}
  >
    Closed
  </button>
</div>

      <div className="shop-grid">
        {filteredShops.map((shop) => (
          <div
            key={shop.id}
            className={`shop-card-A ${!shop.is_active ? "shop-closed" : ""}`}
            onClick={() =>
              shop.is_active && navigate(`/student/shop/${shop.id}`)
            }
          >
            {/* Open / Closed Tag */}
            <div
              className={`shop-status-tag ${
                shop.is_active ? "open" : "closed"
              }`}
            >
              {shop.is_active ? "Open" : "Closed"}
            </div>

            <img
              src={shop.banner_url || ShopFallBack}
              alt={shop.shop_name}
              className="shop-banner-A"
            />

            <div className="shop-info-A">
              <div className="shop-name-badge-A">
                <h3 className="shop-name-A">{shop.shop_name}</h3>
              </div>

              <div className="shop-details-box-A">
                <span className="shop-block-A">
                  <strong>Block:</strong> {shop.block}
                </span>
              </div>

              <div className="shop-details-box-A">
                <span className="shop-time-A">
                  <strong>Closes at:</strong> 10pm
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredShops.length === 0 && (
          <p style={{ padding: 16, color: "#777" }}>No shops found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
