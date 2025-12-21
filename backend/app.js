// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import shopRoutes from './routes/shop.routes.js';
import orderRoutes from './routes/order.routes.js';
import fileRoutes from './routes/file.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import documentRoutes from './routes/document.routes.js';
import printOptionRoutes from './routes/printOptions.routes.js';
import printOptionsRoutes from './routes/printOptions.routes.js';
import paperTypeRoutes from './routes/paperType.routes.js';
import colorModeRoutes from './routes/colorMode.routes.js';
import finishTypeRoutes from './routes/finishType.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import webhookRoutes from './routes/webhook.routes.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', printOptionRoutes);
app.use('/api/print-options', printOptionsRoutes);
app.use('/api/shops', paperTypeRoutes);
app.use('/api/shops', colorModeRoutes);
app.use('/api/shops', finishTypeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);


app.use(errorMiddleware);

export default app;