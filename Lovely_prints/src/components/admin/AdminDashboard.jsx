import { useEffect, useState, useRef } from "react";
import {
  getOrganisations,
  getShopsByOrganisation,
  updateShopStatus,
  getOrganisationAnalytics,
  getShopAnalytics,
  getShopOrders,
} from "../../services/adminService";
import OrganisationAnalytics from "./OrganisationAnalytics";
import ShopAnalytics from "./ShopAnalytics";
import OrganisationTrends from "./OrganisationTrends";
import ShopOrders from "./ShopOrders";
import "./admin-theme.css";
import "./admin.css";
import OrderDrawer from "./OrderDrawer";
import ShopPrintOptionsModal from "./ShopPrintOptionsModal";
import ShopPrintOptions from "./ShopPrintOptions";

const AdminDashboard = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [shops, setShops] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopAnalytics, setShopAnalytics] = useState(null);
  const [shopOrders, setShopOrders] = useState([]);
  const [loadingShopOrders, setLoadingShopOrders] = useState(false);
  const orgAnalyticsCache = useRef({});
  const shopAnalyticsCache = useRef({});
  const shopOrdersCache = useRef({});
  const [activeOrder, setActiveOrder] = useState(null);
  const [printOptionsShop, setPrintOptionsShop] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrganisations();
        setOrganisations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;

    // 🔥 RESET DEPENDENT STATE
    setSelectedShop(null);
    setShopAnalytics(null);
    setShopOrders([]);
    setActiveOrder(null); // 🔥 ADD THIS

    const loadShops = async () => {
      const data = await getShopsByOrganisation(selectedOrg.id);
      setShops(data);
    };

    loadShops();
  }, [selectedOrg]);

  useEffect(() => {
    if (!selectedOrg) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        if (orgAnalyticsCache.current[selectedOrg.id]) {
          setAnalytics(orgAnalyticsCache.current[selectedOrg.id]);
          return;
        }

        const res = await getOrganisationAnalytics(selectedOrg.id);
        orgAnalyticsCache.current[selectedOrg.id] = res.data;
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedOrg]);

  useEffect(() => {
    if (!selectedShop) return;

    const fetchShopAnalytics = async () => {
      if (shopAnalyticsCache.current[selectedShop.id]) {
        setShopAnalytics(shopAnalyticsCache.current[selectedShop.id]);
        return;
      }

      const res = await getShopAnalytics(selectedShop.id);
      shopAnalyticsCache.current[selectedShop.id] = res.data;
      setShopAnalytics(res.data);
    };

    fetchShopAnalytics();
  }, [selectedShop]);

  if (loading) {
    return <div className="skeleton table-skeleton" />;
  }
  return (
    <div className="admin-container">
<div className="admin-header">
  <h1 className="admin-title">Admin Dashboard</h1>

  <button
    className="logout-btn"
    onClick={() => {
      localStorage.clear(); // or remove token only
      window.location.href = "/login";
    }}
  >
    Logout
  </button>
</div>

      {/* 1️⃣ Organisations */}
      <div className="admin-section">
        <h3>Organisations</h3>

        <div className="org-list">
          {organisations.map((org) => (
            <div
              key={org.id}
              className={`org-chip ${
                selectedOrg?.id === org.id ? "active" : ""
              }`}
              onClick={() => setSelectedOrg(org)}
            >
              {org.name}
            </div>
          ))}
        </div>
      </div>

      {/* 2️⃣ Organisation Analytics */}
      {selectedOrg && !loading && (
        <div className="admin-section">
          <OrganisationAnalytics analytics={analytics} />
        </div>
      )}

      {/* 3️⃣ Organisation Trends */}
      {analytics && (
        <div className="admin-section">
          <OrganisationTrends
            ordersByDate={analytics.ordersByDate}
            revenueByDate={analytics.revenueByDate}
          />
        </div>
      )}

      {/* 4️⃣ Shops */}
      {selectedOrg && (
        <div className="admin-section">
          <h3>Shops in {selectedOrg.name}</h3>

          {shops.map((shop) => (
            <div
              key={shop.id}
              className={`shop-row ${
                selectedShop?.id === shop.id ? "active" : ""
              }`}
              onClick={async () => {
                setActiveOrder(null); // 🔥 ADD THISf
                setSelectedShop(shop);
                setShopAnalytics(null);
                setLoadingShopOrders(true);

                try {
                  if (shopOrdersCache.current[shop.id]) {
                    setShopOrders(shopOrdersCache.current[shop.id]);
                    return;
                  }

                  const orders = await getShopOrders(shop.id);
                  shopOrdersCache.current[shop.id] = orders;
                  setShopOrders(orders);
                } finally {
                  setLoadingShopOrders(false);
                }
              }}
            >
              <div className="shop-info">
                <div className="shop-name">{shop.shop_name}</div>
                <div className="shop-block">{shop.block}</div>
              </div>

              <div
                className={`shop-status ${shop.is_active ? "open" : "closed"}`}
              >
                {shop.is_active ? "Open" : "Closed"}
              </div>

              <button
                className="shop-action-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  await updateShopStatus(shop.id, !shop.is_active);
                  const data = await getShopsByOrganisation(selectedOrg.id);
                  setShops(data);
                }}
              >
                {shop.is_active ? "Close" : "Open"}
              </button>

              <button
                className="shop-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setPrintOptionsShop(shop);
                }}
              >
                Print Options
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5️⃣ Shop Analytics */}
      {selectedShop && (
        <div className="admin-section">
          <ShopAnalytics shop={selectedShop} analytics={shopAnalytics} />
        </div>
      )}
      {/* {selectedShop && <ShopPrintOptions shop={selectedShop} />} */}

      {/* 6️⃣ Shop Orders */}
      {selectedShop && (
        <div className="admin-section">
          <ShopOrders
            orders={shopOrders}
            loading={loadingShopOrders}
            onOrderClick={setActiveOrder}
          />
        </div>
      )}
      <OrderDrawer order={activeOrder} onClose={() => setActiveOrder(null)} />
      <ShopPrintOptionsModal
        shop={printOptionsShop}
        onClose={() => setPrintOptionsShop(null)}
      />
    </div>
  );
};

export default AdminDashboard;
