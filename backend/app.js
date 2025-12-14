import express from "express";
import cors from "cors";

import studentRoutes from "./routes/student.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);

export default app;
