import express from 'express';
import 'express-async-errors'; // 支持全局包裹异步错误抛出
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middlewares/errorMiddleware';

import appRoutes from './routes/app';
import adminRoutes from './routes/admin';
import dmRoutes from './routes/dm';
import editorRoutes from './routes/editor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- 路由挂载 ---
app.use('/api/app', appRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dm', dmRoutes);
app.use('/api/editor', editorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Jubensha Backend API is running.', status: 'OK' });
});

// --- 挂载全局异常处理中心中间件，捕获路由层漏出的 Error 和 Zod Error ---
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`[Server]: 独立后端 API 服务启动在 http://localhost:${PORT}`);
});
