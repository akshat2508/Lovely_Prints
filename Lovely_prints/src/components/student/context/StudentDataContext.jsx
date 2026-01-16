import { createContext, useContext, useState } from "react"
import {
  getAllShops,
  getShopPrintOptions,
} from "../../../services/studentService"

const StudentDataContext = createContext(null)

export const StudentDataProvider = ({ children }) => {
  const [shops, setShops] = useState(null)
  const [shopsLoading, setShopsLoading] = useState(false)

  // cache print options by shopId
  const [shopOptionsMap, setShopOptionsMap] = useState({})

  /* ================= SHOPS ================= */
  const fetchShops = async () => {
    if (shops) return shops // ✅ cache hit

    try {
      setShopsLoading(true)
      const res = await getAllShops()
      if (res?.success) {
        setShops(res.data)
        return res.data
      }
    } finally {
      setShopsLoading(false)
    }
  }

  /* ================= SHOP OPTIONS ================= */
  const fetchShopOptions = async (shopId) => {
    if (shopOptionsMap[shopId]) {
      return shopOptionsMap[shopId] // ✅ cache hit
    }

    const res = await getShopPrintOptions(shopId)
    if (res?.success) {
      setShopOptionsMap((prev) => ({
        ...prev,
        [shopId]: res.data,
      }))
      return res.data
    }
  }
    /* ================= CACHE INVALIDATION ================= */
  const invalidateShopOptions = (shopId) => {
    setShopOptionsMap((prev) => {
      const copy = { ...prev }
      delete copy[shopId]
      return copy
    })
  }

  const invalidateAllShopOptions = () => {
    setShopOptionsMap({})
  }


  return (
    <StudentDataContext.Provider
      value={{
        shops,
        shopsLoading,
        fetchShops,
        fetchShopOptions,
        invalidateAllShopOptions,
        invalidateShopOptions
      }}
    >
      {children}
    </StudentDataContext.Provider>
  )
}

export const useStudentData = () => {
  const ctx = useContext(StudentDataContext)
  if (!ctx) {
    throw new Error("useStudentData must be used inside StudentDataProvider")
  }
  return ctx
}
