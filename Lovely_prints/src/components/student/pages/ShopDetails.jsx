import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import CreateOrderModal from "../modals/CreateOrderModal";
import ShopDetailsSkeleton from "../skeletons/ShopDetailsSkeleton";
import ShopFallBack from "../assets/shop1.jpg";
import "./shopDetails.css";

const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { shops, fetchShops, fetchShopOptions, invalidateShopOptions } =
    useStudentData();

  const [shop, setShop] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const allShops = shops || (await fetchShops());
      const found = allShops?.find((s) => String(s.id) === String(shopId));
      setShop(found);

      const opts = await fetchShopOptions(shopId);
      setOptions(opts);

      setLoading(false);
    };

    loadData();
  }, [shopId]);

  if (loading) return <ShopDetailsSkeleton />;
  if (!shop) return <p style={{ padding: 24 }}>Shop not found</p>;

  return (
    <div className="shop-details-B">
      {/* Header */}
      <div className="shop-header-B">
        <div className="shop-header-left-B">
          <h1 className="shop-name-B">{shop.shop_name}</h1>

          <div className="shop-meta-B">
            <span className="meta-label-B">Block:</span>
            <span className="meta-value-B">{shop.block}</span>
          </div>

          <div className="shop-meta-B">
            <span className="meta-label-B">Opens:</span>
            <span className="meta-value-B">{shop.opening_time || "9:00 AM"}</span>
            <span className="meta-label-B">Closes:</span>
            <span className="meta-value-B">{shop.closing_time || "10:00 PM"}</span>
          </div>
        </div>

        <div className="shop-header-right-B">
          <img
            src={shop.banner_url || ShopFallBack}
            alt={shop.shop_name}
            className="shop-header-banner-B"
          />
        </div>
      </div>

      {/* Print Options */}
      <div className="shop-options-B">
        <h2>Print Options Available</h2>
        <div className="options-grid-B">
          {options?.paper_types && (
            <div className="option-group-B">
              <h3>Paper Types</h3>
              {options.paper_types.map((item) => (
                <div key={item.id} className="option-item-B">
                  <span>{item.name}</span>
                  <span>₹{item.base_price || 0}</span>
                  {item.extra_price && <span>+₹{item.extra_price}</span>}
                </div>
              ))}
            </div>
          )}

          {options?.color_modes && (
            <div className="option-group-B">
              <h3>Color Modes</h3>
              {options.color_modes.map((item) => (
                <div key={item.id} className="option-item-B">
                  <span>{item.name}</span>
                  {item.extra_price && <span>+₹{item.extra_price}</span>}
                </div>
              ))}
            </div>
          )}

          {options?.finish_types && (
            <div className="option-group-B">
              <h3>Finish Types</h3>
              {options.finish_types.map((item) => (
                <div key={item.id} className="option-item-B">
                  <span>{item.name}</span>
                  {item.extra_price && <span>+₹{item.extra_price}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shop-actions-B">
        <button
          className="primary-btn-B"
          onClick={() => setShowCreateModal(true)}
        >
          Create Print Order
        </button>
        <button className="secondary-btn-B" onClick={() => navigate("/student")}>
          Back to Shops
        </button>
      </div>

      {showCreateModal && (
        <CreateOrderModal
          shop={shop}
          shopOptions={options}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            invalidateShopOptions(shop.id);
            setShowCreateModal(false);
            navigate("/student/orders");
          }}
        />
      )}
    </div>
  );
};

export default ShopDetails;
