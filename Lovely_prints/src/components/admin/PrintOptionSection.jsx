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
    <div className="print-option-box">
      <h4>{title}</h4>

      <div className="print-option-add">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder={priceLabel}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 50 }} />
      ) : (
        items.map((item) => (
          <div key={item.id} className="print-option-row">
            <span>{item.name}</span>
            <span>₹ {item[priceKey]}</span>
            <button
              className={item.is_active ? "active" : "inactive"}
              onClick={() =>
                toggleFn(item.id, !item.is_active).then(load)
              }
            >
              {item.is_active ? "Disable" : "Enable"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PrintOptionSection;
