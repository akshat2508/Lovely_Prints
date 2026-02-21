import "./admin.css";
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
    <div className="settings-overlay-A" onClick={onClose}>
      <div
        className="settings-panel-A"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="settings-header-A">
          <div>
            <div className="settings-label-A">
              Print Configuration
            </div>
            <h2 className="settings-title-A">
              {shop.shop_name}
            </h2>
          </div>

          <button className="settings-close-A" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-divider-A" />

        {/* Sections */}
        <div className="settings-section-A">
          <PrintOptionSection
            key={`paper-${shop.id}`}
            title="Paper Types"
            priceLabel="Base Price"
            fetchFn={() => getShopPaperTypes(shop.id)}
            addFn={(p) => addShopPaperType(shop.id, p)}
            toggleFn={toggleShopPaperType}
            priceKey="base_price"
          />
        </div>

        <div className="settings-section-A">
          <PrintOptionSection
            key={`color-${shop.id}`}
            title="Color Modes"
            priceLabel="Extra Price"
            fetchFn={() => getShopColorModes(shop.id)}
            addFn={(p) => addShopColorMode(shop.id, p)}
            toggleFn={toggleShopColorMode}
            priceKey="extra_price"
          />
        </div>

        <div className="settings-section-A">
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
    </div>
  );
};

export default ShopPrintOptionsModal;