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
    setter(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const handlePriceChange = (setter, id, value) => {
    setter(prev => prev.map(item => 
      item.id === id ? { ...item, price: parseFloat(value) || 0 } : item
    ));
  };

  const handleSave = () => {
    console.log('Pricing settings saved');
  };

  return (
    <div className="pricing-settings">
      <h2>Pricing Configuration</h2>
      
      <div className="pricing-section">
        <h3>Paper Types</h3>
        <div className="pricing-options">
          {paperTypes.map(item => (
            <div key={item.id} className="pricing-item">
              <div className="pricing-checkbox">
                <input
                  type="checkbox"
                  id={`paper-${item.id}`}
                  checked={item.enabled}
                  onChange={() => handleToggle(setPaperTypes, item.id)}
                />
                <label htmlFor={`paper-${item.id}`}>{item.name}</label>
              </div>
              <div className="pricing-input">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.price}
                  disabled={!item.enabled}
                  onChange={(e) => handlePriceChange(setPaperTypes, item.id, e.target.value)}
                />
                <span className="currency">₹</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pricing-section">
        <h3>Color Modes</h3>
        <div className="pricing-options">
          {colorModes.map(item => (
            <div key={item.id} className="pricing-item">
              <div className="pricing-checkbox">
                <input
                  type="checkbox"
                  id={`color-${item.id}`}
                  checked={item.enabled}
                  onChange={() => handleToggle(setColorModes, item.id)}
                />
                <label htmlFor={`color-${item.id}`}>{item.name}</label>
              </div>
              <div className="pricing-input">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.price}
                  disabled={!item.enabled}
                  onChange={(e) => handlePriceChange(setColorModes, item.id, e.target.value)}
                />
                <span className="currency">₹</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pricing-section">
        <h3>Finish Types</h3>
        <div className="pricing-options">
          {finishTypes.map(item => (
            <div key={item.id} className="pricing-item">
              <div className="pricing-checkbox">
                <input
                  type="checkbox"
                  id={`finish-${item.id}`}
                  checked={item.enabled}
                  onChange={() => handleToggle(setFinishTypes, item.id)}
                />
                <label htmlFor={`finish-${item.id}`}>{item.name}</label>
              </div>
              <div className="pricing-input">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.price}
                  disabled={!item.enabled}
                  onChange={(e) => handlePriceChange(setFinishTypes, item.id, e.target.value)}
                />
                <span className="currency">₹</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pricing-actions">
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}