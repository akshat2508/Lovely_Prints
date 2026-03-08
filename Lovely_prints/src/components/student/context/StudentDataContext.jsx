import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllShops,
  getShopPrintOptions,
} from "../../../services/studentService";
import { supabase } from "../../../services/supabase";
const StudentDataContext = createContext(null);

export const StudentDataProvider = ({ children }) => {
  const [shops, setShops] = useState(null);
  const [shopsLoading, setShopsLoading] = useState(false);

  // cache print options by shopId
  const [shopOptionsMap, setShopOptionsMap] = useState({});

  /* ================= FLOW STATE ================= */

  // 1 = Choose Shop
  // 2 = Print Options
  // 3 = Upload & Pickup
  // 4 = Review Order
  // 5 = Orders

  const [flowStage, setFlowStage] = useState(1);

  const goToFlowStage = (stage) => {
    setFlowStage(stage);
  };

  const resetFlow = () => {
    setFlowStage(1);
  };

  /* ================= SHOPS ================= */

  const fetchShops = async (isPolling = false) => {
    try {
      if (!isPolling) setShopsLoading(true);

      const res = await getAllShops();
      if (!res?.success) return;

      setShops((prevShops) => {
        if (!prevShops) return res.data;

        return prevShops.map((oldShop) => {
          const updatedShop = res.data.find((s) => s.id === oldShop.id);

          if (!updatedShop) return oldShop;

          // Update both fields if changed
          if (
            oldShop.is_active !== updatedShop.is_active ||
            oldShop.is_accepting_orders !== updatedShop.is_accepting_orders
          ) {
            return {
              ...oldShop,
              is_active: updatedShop.is_active,
              is_accepting_orders: updatedShop.is_accepting_orders,
            };
          }

          return oldShop;
        });
      });

      return res.data;
    } catch (err) {
      console.error("Failed to fetch shops");
    } finally {
      if (!isPolling) setShopsLoading(false);
    }
  };

 useEffect(() => {
  // initial load
  fetchShops(false);

  supabase.realtime.setAuth(localStorage.getItem("access_token"));

  const channel = supabase
    .channel("shops-realtime")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "shops",
      },
      (payload) => {
        const updatedShop = payload.new;

        setShops((prevShops) => {
          if (!prevShops) return prevShops;

          return prevShops.map((shop) =>
            shop.id === updatedShop.id
              ? {
                  ...shop,
                  is_active: updatedShop.is_active,
                  is_accepting_orders: updatedShop.is_accepting_orders,
                }
              : shop
          );
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  /* ================= SHOP OPTIONS ================= */

  const fetchShopOptions = async (shopId) => {
    if (shopOptionsMap[shopId]) {
      return shopOptionsMap[shopId];
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
        // Shops
        shops,
        shopsLoading,
        fetchShops,
        fetchShopOptions,
        invalidateAllShopOptions,
        invalidateShopOptions,

        // Flow
        flowStage,
        setFlowStage,
        goToFlowStage,
        resetFlow,
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
