import { useEffect, useState } from "react";
import "./printOptions.css";

const PrintOptionSection = ({
  title,
  priceLabel,
  fetchFn,
  addFn,
  toggleFn,
  priceKey,
}) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchFn();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!name || price === "") return;
    await addFn({ name, [priceKey]: Number(price) });
    setName("");
    setPrice("");
    load();
  };

  return (
    <div className="config-section-A">

      <div className="config-header-A">
        <h3 className="config-title-A">{title}</h3>
      </div>

      {/* Add Row */}
      <div className="config-add-row-A">
        <input
          className="config-input-A"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="config-input-A"
          placeholder={priceLabel}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button className="config-add-btn-A" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* Items */}
      {loading ? (
        <div className="config-skeleton-A skeleton-A" />
      ) : (
        <div className="config-list-A">
          {items.map((item) => (
            <div key={item.id} className="config-row-A">
              <div className="config-left-A">
                <div className="config-name-A">
                  {item.name}
                </div>
                <div className="config-price-A">
                  ₹ {item[priceKey]}
                </div>
              </div>

              <button
                className={`config-toggle-A ${
                  item.is_active ? "enabled" : "disabled"
                }`}
                onClick={() =>
                  toggleFn(item.id, !item.is_active).then(load)
                }
              >
                {item.is_active ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PrintOptionSection;