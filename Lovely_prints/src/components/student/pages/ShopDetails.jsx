import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getAllShops,
  getShopPrintOptions,
} from "../../../services/studentService"

import CreateOrderModal from "../modals/CreateOrderModal"
import "./shopDetails.css"

const ShopDetails = () => {
  const { shopId } = useParams()
  const navigate = useNavigate()

  const [shop, setShop] = useState(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true)

        // 1️⃣ Get shop basic info
        const shopsRes = await getAllShops()
        const foundShop = shopsRes?.data?.find(
          (s) => String(s.id) === String(shopId)
        )
        setShop(foundShop)

        // 2️⃣ Get print options
        const optionsRes = await getShopPrintOptions(shopId)
        if (optionsRes?.success) {
          setOptions(optionsRes.data)
        }
      } catch (err) {
        console.error("Failed to load shop details", err)
      } finally {
        setLoading(false)
      }
    }

    loadShopData()
  }, [shopId])

  if (loading) return <p style={{ padding: 24 }}>Loading shop...</p>

  if (!shop) return <p style={{ padding: 24 }}>Shop not found</p>

  return (
    <div className="shop-details">
      {/* Header */}
      <div className="shop-header">
        <img
          src={shop.banner_url || "/default-shop-banner.jpg"}
          alt={shop.shop_name}
          className="shop-header-banner"
        />

        <div className="shop-header-info">
          <h1>{shop.shop_name}</h1>
          <p>{shop.block}</p>
        </div>
      </div>

      {/* Print Options */}
      <div className="shop-options">
        <h2>Print Options Available</h2>

        <div className="options-grid">
          <OptionGroup title="Paper Types" items={options?.paper_types} />
          <OptionGroup title="Color Modes" items={options?.color_modes} />
          <OptionGroup title="Finish Types" items={options?.finish_types} />
        </div>
      </div>

      {/* Actions */}
      <div className="shop-actions">
        <button
          className="primary-btn"
          onClick={() => setShowCreateModal(true)}
        >
          Create Print Order
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/student")}
        >
          Back to Shops
        </button>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          shop={shop}
          shopOptions={options}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            navigate("/student/orders")
          }}
        />
      )}
    </div>
  )
}

const OptionGroup = ({ title, items = [] }) => (
  <div className="option-group">
    <h3>{title}</h3>
    {items.length === 0 ? (
      <p className="muted">No options</p>
    ) : (
      items.map((item) => (
        <div key={item.id} className="option-item">
          <span>{item.name}</span>
          {item.base_price !== undefined && (
            <span>₹{item.base_price}</span>
          )}
          {item.extra_price !== undefined && (
            <span>+₹{item.extra_price}</span>
          )}
        </div>
      ))
    )}
  </div>
)

export default ShopDetails
