import admin from "../config/firebase.js";
import supabaseService from "./supabase.service.js";

export const sendPushToUser = async ({
  userId,
  title,
  body,
}) => {
  try {
    const { data: tokens, error } =
      await supabaseService.getUserDeviceTokens(userId);

    if (error) throw error;
    if (!tokens || tokens.length === 0) return;

    await Promise.all(
      tokens.map(t =>
        admin.messaging().send({
          token: t.fcm_token,
          notification: { title, body },
        })
      )
    );

    console.log("Push notifications sent");
  } catch (err) {
    console.error("Push error:", err.message);
  }
};
