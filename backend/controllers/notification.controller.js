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

export const unregisterDeviceToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        error: "userId and token are required",
      });
    }

    const { error } =
      await supabaseService.unregisterDeviceToken(userId, token);

    if (error) throw error;

    res.status(200).json({
      message: "Device unregistered successfully",
    });

  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({
      error: "Failed to unregister device",
    });
  }
};