import { useEffect, useState } from "react";
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
import "./admin.css"
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
        const res = await getOrganisationAnalytics(selectedOrg.id);
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
      try {
        const res = await getShopAnalytics(selectedShop.id);
        setShopAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShopAnalytics();
  }, [selectedShop]);

  if (loading) return <p>Loading organisations...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

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
                setSelectedShop(shop);
                setShopAnalytics(null);
                setLoadingShopOrders(true);

                try {
                  const orders = await getShopOrders(shop.id);
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

              <div className={`shop-status ${shop.is_active ? "open" : "closed"}`}>
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
            </div>
          ))}
        </div>
      )}

      {!loading && <OrganisationAnalytics analytics={analytics} />}

      <ShopAnalytics shop={selectedShop} analytics={shopAnalytics} />


      {analytics && (
          <OrganisationTrends
          ordersByDate={analytics.ordersByDate}
          revenueByDate={analytics.revenueByDate}
          />
        )}
        {selectedShop && (
          <ShopOrders orders={shopOrders} loading={loadingShopOrders} />
        )}
    </div>
  );
};

export default AdminDashboard;
