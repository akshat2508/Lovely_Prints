import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllShops } from "../../../services/studentService"
import "./studentHome.css"

const StudentHome = () => {
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const res = await getAllShops()
        if (res?.success) {
          setShops(res.data || [])
        }
      } catch (err) {
        console.error("Failed to fetch shops", err)
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  return (
    <div className="student-home">
      <h1 className="student-home-title">Choose a Print Shop</h1>

      {loading && <p>Loading shops...</p>}

      <div className="shop-grid">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="shop-card"
            onClick={() => navigate(`/student/shop/${shop.id}`)}
          >
            <img
              src={shop.banner_url || "/default-shop-banner.jpg"}
              alt={shop.shop_name}
              className="shop-banner"
            />

            <div className="shop-info">
              <h3>{shop.shop_name}</h3>
              <p className="shop-block">{shop.block}</p>
            </div>
          </div>
        ))}

        {!loading && shops.length === 0 && (
          <p>No print shops available right now</p>
        )}
      </div>
    </div>
  )
}

export default StudentHome
