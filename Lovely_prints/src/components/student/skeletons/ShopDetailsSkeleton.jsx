import "./skeletons.css"

const ShopDetailsSkeleton = () => {
  return (
    <div className="shop-details">
      {/* Header Skeleton */}
      <div className="shop-header">
        <div className="shop-header-banner skeleton" />

        <div className="shop-header-info">
          <div className="skeleton-text short" />
          <div className="skeleton-text tiny" />
        </div>
      </div>

      {/* Options Skeleton */}
      <div className="shop-options">
        <h2>Print Options Available</h2>

        <div className="options-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="option-group skeleton">
              <div className="skeleton-text short" />
              <div className="skeleton-text tiny" />
              <div className="skeleton-text tiny" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopDetailsSkeleton
