import express from "express";
import { registerDeviceToken } from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/register-device", registerDeviceToken);

export default router;
