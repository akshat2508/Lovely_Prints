import { useEffect, useState } from "react"
import { getCurrentUser } from "../../../services/authService"
import "../dashboard.css"
import ProfileSkeleton from "../skeletons/ProfileSkeleton"

const StudentProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        setUser(res.data.user) 
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <ProfileSkeleton/>
}

  if (!user) {
    return <p style={{ padding: 24 }}>Unable to load profile</p>
  }

  return (
    <div className="profile-page">
      <h1 className="profile-title">My Profile</h1>

      <div className="order-card-pro profile-card">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span className="profile-value">
            {user.user_metadata?.name || "—"}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>

        
      </div>

      <div className="profile-hint">
        Profile editing will be available soon.
      </div>
    </div>
  )
}

export default StudentProfile
