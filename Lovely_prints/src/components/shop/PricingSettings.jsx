import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  createPaperType,
  createColorMode,
  createFinishType
} from "../../services/shopService";
import "./shop.css";

export default function PricingSettings() {
  const [shopId, setShopId] = useState(null);

  const [paperTypes, setPaperTypes] = useState([]);
  const [colorModes, setColorModes] = useState([]);
  const [finishTypes, setFinishTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* New option inputs */
  const [newPaper, setNewPaper] = useState({ name: "", base_price: "" });
  const [newColor, setNewColor] = useState({ name: "", extra_price: "" });
  const [newFinish, setNewFinish] = useState({ name: "", extra_price: "" });

  /* ================= INIT ================= */

  useEffect(() => {
    const init = async () => {
      try {
        const shopRes = await api.get("/shops/me");
        const id = shopRes.data.data.id;
        setShopId(id);

        const [paper, color, finish] = await Promise.all([
          api.get(`/shops/${id}/paper-types`),
          api.get(`/shops/${id}/color-modes`),
          api.get(`/shops/${id}/finish-types`)
        ]);

        setPaperTypes(paper.data.data);
        setColorModes(color.data.data);
        setFinishTypes(finish.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load pricing config ❌");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* ================= TOGGLE ================= */

  const toggleActive = (list, setter, id) => {
    setter(
      list.map(item =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      )
    );
  };

  /* ================= SAVE PATCH ================= */

  const saveChanges = async () => {
    try {
      setSaving(true);

      const requests = [];

      paperTypes.forEach(p =>
        requests.push(api.patch(`/shops/paper-types/${p.id}`, { is_active: p.is_active }))
      );

      colorModes.forEach(c =>
        requests.push(api.patch(`/shops/color-modes/${c.id}`, { is_active: c.is_active }))
      );

      finishTypes.forEach(f =>
        requests.push(api.patch(`/shops/finish-types/${f.id}`, { is_active: f.is_active }))
      );

      await Promise.all(requests);
      alert("Availability updated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes ❌");
    } finally {
      setSaving(false);
    }
  };

  /* ================= CREATE ================= */

  const addPaperType = async () => {
    const res = await createPaperType(shopId, {
      name: newPaper.name,
      base_price: Number(newPaper.base_price)
    });
    setPaperTypes(prev => [...prev, res.data]);
    setNewPaper({ name: "", base_price: "" });
  };

  const addColorMode = async () => {
    const res = await createColorMode(shopId, {
      name: newColor.name,
      extra_price: Number(newColor.extra_price)
    });
    setColorModes(prev => [...prev, res.data]);
    setNewColor({ name: "", extra_price: "" });
  };

  const addFinishType = async () => {
    const res = await createFinishType(shopId, {
      name: newFinish.name,
      extra_price: Number(newFinish.extra_price)
    });
    setFinishTypes(prev => [...prev, res.data]);
    setNewFinish({ name: "", extra_price: "" });
  };

  if (loading) return <p className="muted">Loading pricing settings...</p>;

  return (
    <div className="pricing-settings">
      <h2 className="pricing-title">Pricing Configuration</h2>

      {/* ================= PAPER ================= */}
      <Section
        title="Paper Types"
        items={paperTypes}
        onToggle={toggleActive}
        setter={setPaperTypes}
        addForm={
          <AddRow
            name={newPaper.name}
            price={newPaper.base_price}
            onName={v => setNewPaper(p => ({ ...p, name: v }))}
            onPrice={v => setNewPaper(p => ({ ...p, base_price: v }))}
            onAdd={addPaperType}
          />
        }
      />

      {/* ================= COLOR ================= */}
      <Section
        title="Color Modes"
        items={colorModes}
        onToggle={toggleActive}
        setter={setColorModes}
        addForm={
          <AddRow
            name={newColor.name}
            price={newColor.extra_price}
            onName={v => setNewColor(c => ({ ...c, name: v }))}
            onPrice={v => setNewColor(c => ({ ...c, extra_price: v }))}
            onAdd={addColorMode}
          />
        }
      />

      {/* ================= FINISH ================= */}
      <Section
        title="Finish Types"
        items={finishTypes}
        onToggle={toggleActive}
        setter={setFinishTypes}
        addForm={
          <AddRow
            name={newFinish.name}
            price={newFinish.extra_price}
            onName={v => setNewFinish(f => ({ ...f, name: v }))}
            onPrice={v => setNewFinish(f => ({ ...f, extra_price: v }))}
            onAdd={addFinishType}
          />
        }
      />

      <button className="save-button" disabled={saving} onClick={saveChanges}>
        {saving ? "Saving..." : "Save Availability"}
      </button>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Section = ({ title, items, onToggle, setter, addForm }) => (
  <div className="config-section">
    <h3>{title}</h3>

    {items.map(item => (
      <div key={item.id} className="config-row">
        <label>
          <input
            type="checkbox"
            checked={item.is_active}
            onChange={() => onToggle(items, setter, item.id)}
          />
          {item.name}
        </label>

        <span>₹ {item.base_price ?? item.extra_price ?? 0}</span>
      </div>
    ))}

    {addForm}
  </div>
);

const AddRow = ({ name, price, onName, onPrice, onAdd }) => (
  <div className="config-row add-row">
    <input placeholder="Name" value={name} onChange={e => onName(e.target.value)} />
    <input placeholder="Price" type="number" value={price} onChange={e => onPrice(e.target.value)} />
    <button onClick={onAdd}>Add</button>
  </div>
);
