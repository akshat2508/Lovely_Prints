import "./skeletons.css"

const OrdersSkeleton = ({ count = 5 }) => {
  return (
    <div className="orders-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="order-card1 skeleton order-skeleton-card">
          <div className="order-left">
            <div className="skeleton-text short" />
            <div className="skeleton-text tiny" />
            <div className="skeleton-text tiny" />
          </div>

          <div className="order-right">
            <div className="skeleton-text tiny" />
            <div className="skeleton-text short" />
            <div className="skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrdersSkeleton
