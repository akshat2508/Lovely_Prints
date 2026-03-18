import express from "express";
import { registerDeviceToken , unregisterDeviceToken } from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/register-device", registerDeviceToken);
router.post("/unregister-device", unregisterDeviceToken);

export default router;
