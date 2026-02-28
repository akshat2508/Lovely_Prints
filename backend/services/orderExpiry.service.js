import supabaseAdmin from "../config/supabaseAdmin.js";

export const runOrderExpiryCheck = async () => {
  try {
    console.log("⏳ Running order expiry check...");

    const { error } = await supabaseAdmin.rpc("expire_orders" ,{} );

    if (error) {
      console.error("❌ Expiry failed:", error.message);
    } else {
      console.log("✅ Order expiry check completed");
    }
  } catch (err) {
    console.error("❌ Unexpected expiry error:", err.message);
  }
};