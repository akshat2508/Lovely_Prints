import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  createPaperType,
  createColorMode,
  createFinishType
} from "../../services/shopService";
import "./pricingSettings.css";
import ProfileSkeleton from "../student/skeletons/ProfileSkeleton"
export default function PricingSettings() {
  const [shopId, setShopId] = useState(null);

  const [paperTypes, setPaperTypes] = useState([]);
  const [colorModes, setColorModes] = useState([]);
  const [finishTypes, setFinishTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newPaper, setNewPaper] = useState({ name: "", price: "" });
  const [newColor, setNewColor] = useState({ name: "", price: "" });
  const [newFinish, setNewFinish] = useState({ name: "", price: "" });

  /* ================= INIT ================= */

  useEffect(() => {
    const init = async () => {
      try {
        const shopRes = await api.get("/shops/me");
        const id = shopRes.data.data.id;
        setShopId(id);

        const res = await api.get(`/shops/${id}/options`);
        setPaperTypes(res.data.data.paper_types);
        setColorModes(res.data.data.color_modes);
        setFinishTypes(res.data.data.finish_types);
      } catch (err) {
        alert("Failed to load pricing settings ❌");
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

  /* ================= SAVE ================= */

  const saveChanges = async () => {
    try {
      setSaving(true);

      await Promise.all([
        ...paperTypes.map(p =>
          api.patch(`/shops/paper-types/${p.id}`, { is_active: p.is_active })
        ),
        ...colorModes.map(c =>
          api.patch(`/shops/color-modes/${c.id}`, { is_active: c.is_active })
        ),
        ...finishTypes.map(f =>
          api.patch(`/shops/finish-types/${f.id}`, { is_active: f.is_active })
        )
      ]);

      alert("Pricing updated successfully ✅");
    } catch {
      alert("Failed to save changes ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton/>;
  }

  return (
    <div className="pricing-page-P">
      <div className="pricing-header-P">
        <h2>Pricing & Availability</h2>
        <p>Manage what customers can choose and how much it costs</p>
      </div>

      <div className="pricing-grid-P">
        <PricingCard
          title="Paper Types"
          subtitle="Base price per page"
          items={paperTypes}
          onToggle={toggleActive}
          setter={setPaperTypes}
          addForm={
            <AddRow
              name={newPaper.name}
              price={newPaper.price}
              onName={v => setNewPaper(p => ({ ...p, name: v }))}
              onPrice={v => setNewPaper(p => ({ ...p, price: v }))}
              onAdd={async () => {
                const res = await createPaperType(shopId, {
                  name: newPaper.name,
                  base_price: Number(newPaper.price)
                });
                setPaperTypes(p => [...p, res.data]);
                setNewPaper({ name: "", price: "" });
              }}
            />
          }
        />

        <PricingCard
          title="Color Modes"
          subtitle="Additional charge per page"
          items={colorModes}
          onToggle={toggleActive}
          setter={setColorModes}
          addForm={
            <AddRow
              name={newColor.name}
              price={newColor.price}
              onName={v => setNewColor(c => ({ ...c, name: v }))}
              onPrice={v => setNewColor(c => ({ ...c, price: v }))}
              onAdd={async () => {
                const res = await createColorMode(shopId, {
                  name: newColor.name,
                  extra_price: Number(newColor.price)
                });
                setColorModes(c => [...c, res.data]);
                setNewColor({ name: "", price: "" });
              }}
            />
          }
        />

        <PricingCard
          title="Finish Types"
          subtitle="Binding / finishing charges"
          items={finishTypes}
          onToggle={toggleActive}
          setter={setFinishTypes}
          addForm={
            <AddRow
              name={newFinish.name}
              price={newFinish.price}
              onName={v => setNewFinish(f => ({ ...f, name: v }))}
              onPrice={v => setNewFinish(f => ({ ...f, price: v }))}
              onAdd={async () => {
                const res = await createFinishType(shopId, {
                  name: newFinish.name,
                  extra_price: Number(newFinish.price)
                });
                setFinishTypes(f => [...f, res.data]);
                setNewFinish({ name: "", price: "" });
              }}
            />
          }
        />
      </div>

      <div className="pricing-footer-P">
        <button className="save-btn-P" onClick={saveChanges} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const PricingCard = ({ title, subtitle, items, onToggle, setter, addForm }) => (
  <section className="pricing-card-P">
    <header className="pricing-card-header-P">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </header>

    <div className="pricing-table-P">
      {items.map(item => (
        <div key={item.id} className="pricing-row-P">
          <label className="toggle-P">
            <input
              type="checkbox"
              checked={item.is_active}
              onChange={() => onToggle(items, setter, item.id)}
            />
            <span></span>
          </label>

          <span className="pricing-name-P">{item.name}</span>

          <span className="pricing-price-P">
            ₹ {item.base_price ?? item.extra_price ?? 0}
          </span>
        </div>
      ))}
    </div>

    <div className="pricing-add-P">
      <h4>Add new</h4>
      {addForm}
    </div>
  </section>
);

const AddRow = ({ name, price, onName, onPrice, onAdd }) => (
  <div className="add-row-P">
    <input
      placeholder="Option name"
      value={name}
      onChange={e => onName(e.target.value)}
    />
    <input
      placeholder="Price (₹)"
      type="number"
      value={price}
      onChange={e => onPrice(e.target.value)}
    />
    <button onClick={onAdd}>Add</button>
  </div>
);