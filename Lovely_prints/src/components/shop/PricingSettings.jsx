import React, { useState } from 'react';

export default function PricingSettings() {
  const [paperTypes, setPaperTypes] = useState([
    { id: 'a4', name: 'A4', enabled: true, price: 2 },
    { id: 'a3', name: 'A3', enabled: true, price: 5 }
  ]);

  const [colorModes, setColorModes] = useState([
    { id: 'bw', name: 'B&W', enabled: true, price: 0 },
    { id: 'color', name: 'Color', enabled: true, price: 10 }
  ]);

  const [finishTypes, setFinishTypes] = useState([
    { id: 'matte', name: 'Matte', enabled: true, price: 0 },
    { id: 'glossy', name: 'Glossy', enabled: true, price: 5 }
  ]);

  const handleToggle = (setter, id) => {
    setter(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handlePriceChange = (setter, id, value) => {
    setter(prev =>
      prev.map(item =>
        item.id === id ? { ...item, price: Number(value) || 0 } : item
      )
    );
  };

  const renderSection = (title, items, setter, prefix) => (
    <div className="config-section">
      <h3>{title}</h3>

      {items.map(item => (
        <div key={item.id} className="config-row">
          <label className="config-label">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={() => handleToggle(setter, item.id)}
            />
            <span>{item.name}</span>
          </label>

          <div className="price-control">
            <span className="currency">₹</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={item.price}
              disabled={!item.enabled}
              onChange={(e) =>
                handlePriceChange(setter, item.id, e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pricing-settings">
      <h2 className="pricing-title">Pricing Configuration</h2>


      <div className="config-grid">
        {renderSection('Paper Types', paperTypes, setPaperTypes, 'paper')}
        {renderSection('Color Modes', colorModes, setColorModes, 'color')}
        {renderSection('Finish Types', finishTypes, setFinishTypes, 'finish')}
      </div>
      

      <div className="pricing-actions">
        <button className="save-button" onClick={() => console.log('Saved')}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
