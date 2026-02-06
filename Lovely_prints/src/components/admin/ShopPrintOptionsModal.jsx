import "./admin.css";
import "./admin-theme.css";
import "./printOptions.css";

import PrintOptionSection from "./PrintOptionSection";
import {
  getShopPaperTypes,
  addShopPaperType,
  toggleShopPaperType,
  getShopColorModes,
  addShopColorMode,
  toggleShopColorMode,
  getShopFinishTypes,
  addShopFinishType,
  toggleShopFinishType,
} from "../../services/adminService";

const ShopPrintOptionsModal = ({ shop, onClose }) => {
  if (!shop) return null;

  return (
    <div className="order-drawer-backdrop" onClick={onClose}>
      <div
        className="order-drawer print-options-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h3>Print Options – {shop.shop_name}</h3>
          <button className="drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <PrintOptionSection
          key={`paper-${shop.id}`}
          title="Paper Types"
          priceLabel="Base Price"
          fetchFn={() => getShopPaperTypes(shop.id)}
          addFn={(p) => addShopPaperType(shop.id, p)}
          toggleFn={toggleShopPaperType}
          priceKey="base_price"
        />

        <PrintOptionSection
          key={`color-${shop.id}`}
          title="Color Modes"
          priceLabel="Extra Price"
          fetchFn={() => getShopColorModes(shop.id)}
          addFn={(p) => addShopColorMode(shop.id, p)}
          toggleFn={toggleShopColorMode}
          priceKey="extra_price"
        />

        <PrintOptionSection
          key={`finish-${shop.id}`}
          title="Finish Types"
          priceLabel="Extra Price"
          fetchFn={() => getShopFinishTypes(shop.id)}
          addFn={(p) => addShopFinishType(shop.id, p)}
          toggleFn={toggleShopFinishType}
          priceKey="extra_price"
        />
      </div>
    </div>
  );
};

export default ShopPrintOptionsModal;
