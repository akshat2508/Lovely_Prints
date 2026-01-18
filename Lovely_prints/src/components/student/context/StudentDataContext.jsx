import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllShops,
  getShopPrintOptions,
} from "../../../services/studentService";

const StudentDataContext = createContext(null);

export const StudentDataProvider = ({ children }) => {
  const [shops, setShops] = useState(null);
  const [shopsLoading, setShopsLoading] = useState(false);

  // cache print options by shopId
  const [shopOptionsMap, setShopOptionsMap] = useState({});

  /* ================= SHOPS ================= */


const fetchShops = async (isPolling = false) => {
  try {
    if (!isPolling) setShopsLoading(true);

    const res = await getAllShops();
    if (!res?.success) return;

    setShops((prevShops) => {
      // first load
      if (!prevShops) return res.data;

      // patch only changed shops
      return prevShops.map((oldShop) => {
        const updatedShop = res.data.find(
          (s) => s.id === oldShop.id
        );

        // shop removed (rare)
        if (!updatedShop) return oldShop;

        // only patch if status changed
        if (oldShop.is_active !== updatedShop.is_active) {
          return { ...oldShop, is_active: updatedShop.is_active };
        }

        return oldShop; // no change → no re-render
      });
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch shops");
  } finally {
    if (!isPolling) setShopsLoading(false);
  }
};


  // ✅ INITIAL FETCH + POLLING
 useEffect(() => {
  fetchShops(false); // initial load (shows skeleton)

  const interval = setInterval(() => {
    fetchShops(true); // polling (NO loading, NO flicker)
  }, 15000);

  return () => clearInterval(interval);
}, []);

  /* ================= SHOP OPTIONS ================= */

  const fetchShopOptions = async (shopId) => {
    if (shopOptionsMap[shopId]) {
      return shopOptionsMap[shopId]; // cache hit
    }

    const res = await getShopPrintOptions(shopId);
    if (res?.success) {
      setShopOptionsMap((prev) => ({
        ...prev,
        [shopId]: res.data,
      }));
      return res.data;
    }
  };

  /* ================= CACHE INVALIDATION ================= */

  const invalidateShopOptions = (shopId) => {
    setShopOptionsMap((prev) => {
      const copy = { ...prev };
      delete copy[shopId];
      return copy;
    });
  };

  const invalidateAllShopOptions = () => {
    setShopOptionsMap({});
  };

  return (
    <StudentDataContext.Provider
      value={{
        shops,
        shopsLoading,
        fetchShops,
        fetchShopOptions,
        invalidateAllShopOptions,
        invalidateShopOptions,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = () => {
  const ctx = useContext(StudentDataContext);
  if (!ctx) {
    throw new Error("useStudentData must be used inside StudentDataProvider");
  }
  return ctx;
};
