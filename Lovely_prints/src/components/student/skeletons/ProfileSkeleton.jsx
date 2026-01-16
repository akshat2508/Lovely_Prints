import "./skeletons.css"

const ProfileSkeleton = () => {
  return (
    <div className="profile-page">
      <div className="skeleton-text short" style={{ marginBottom: 16 }} />

      <div className="order-card-pro skeleton profile-skeleton-card">
        <div className="profile-row">
          <div className="skeleton-text short" />
          <div className="skeleton-text tiny" />
        </div>

        <div className="profile-row">
          <div className="skeleton-text short" />
          <div className="skeleton-text tiny" />
        </div>

        <div className="profile-row">
          <div className="skeleton-text short" />
          <div className="skeleton-text tiny" />
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
