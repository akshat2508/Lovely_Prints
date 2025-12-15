// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import shopRoutes from './routes/shop.routes.js';
import orderRoutes from './routes/order.routes.js';
import fileRoutes from './routes/file.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/files', fileRoutes);

app.use(errorMiddleware);

export default app;