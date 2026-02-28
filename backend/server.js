// server.js
import cron from "node-cron";
import { runOrderExpiryCheck } from "./services/orderExpiry.service.js";
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  await runOrderExpiryCheck();
});