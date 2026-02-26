import { useEffect, useState } from "react";
import api from "../../services/api";
import "./pricingSettings.css";
import ProfileSkeleton from "../student/skeletons/ProfileSkeleton";

export default function PricingSettings() {
  const [shopId, setShopId] = useState(null);

  const [paperTypes, setPaperTypes] = useState([]);
  const [colorModes, setColorModes] = useState([]);
  const [finishTypes, setFinishTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      } catch {
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
    return <ProfileSkeleton />;
  }

  return (
    <div className="pricing-page-P">
      <div className="pricing-header-P">
        <h2>Pricing & Availability</h2>
        <p>Enable or disable print options for your shop</p>
      </div>

      <div className="pricing-grid-P">
        <PricingCard
          title="Paper Types"
          subtitle="Base price per page (managed by admin)"
          items={paperTypes}
          setter={setPaperTypes}
          onToggle={toggleActive}
        />

        <PricingCard
          title="Color Modes"
          subtitle="Additional charge per page (managed by admin)"
          items={colorModes}
          setter={setColorModes}
          onToggle={toggleActive}
        />

        <PricingCard
          title="Finish Types"
          subtitle="Binding / finishing charges (managed by admin)"
          items={finishTypes}
          setter={setFinishTypes}
          onToggle={toggleActive}
        />
      </div>

      <div className="pricing-footer-P">
        <button
          className="save-btn-P"
          onClick={saveChanges}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

const PricingCard = ({
  title,
  subtitle,
  items,
  setter,
  onToggle
}) => (
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
  </section>
);