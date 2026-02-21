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

const ShopPrintOptions = ({ shop }) => {
  return (
    <div className="admin-section-A">
      <h3>Print Options – {shop.shop_name}</h3>

      <PrintOptionSection
        key={`paper-${shop.id}`}
        title="Paper Types"
        priceLabel="Base Price"
        fetchFn={() => getShopPaperTypes(shop.id)}
        addFn={(payload) => addShopPaperType(shop.id, payload)}
        toggleFn={toggleShopPaperType}
        priceKey="base_price"
      />

      <PrintOptionSection
        key={`color-${shop.id}`}
        title="Color Modes"
        priceLabel="Extra Price"
        fetchFn={() => getShopColorModes(shop.id)}
        addFn={(payload) => addShopColorMode(shop.id, payload)}
        toggleFn={toggleShopColorMode}
        priceKey="extra_price"
      />

      <PrintOptionSection
        key={`finish-${shop.id}`}
        title="Finish Types"
        priceLabel="Extra Price"
        fetchFn={() => getShopFinishTypes(shop.id)}
        addFn={(payload) => addShopFinishType(shop.id, payload)}
        toggleFn={toggleShopFinishType}
        priceKey="extra_price"
      />
    </div>
  );
};

export default ShopPrintOptions;
