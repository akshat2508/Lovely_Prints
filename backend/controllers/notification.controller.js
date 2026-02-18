import supabaseService from "../services/supabase.service.js";

export const registerDeviceToken = async (req, res) => {
  try {
    const { userId, token, platform } = req.body;

    const { error } = await supabaseService.registerDeviceToken(
      userId,
      token,
      platform
    );

    if (error) throw error;

    res.status(200).json({ message: "Token registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register token" });
  }
};
