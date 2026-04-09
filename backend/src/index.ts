import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import appRoutes from './routes/app';
import adminRoutes from './routes/admin';
import dmRoutes from './routes/dm';
import editorRoutes from './routes/editor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 挂载前台 App 接口路由 (C端)
app.use('/api/app', appRoutes);

// 挂载后台管理系统接口路由 (B端)
app.use('/api/admin', adminRoutes);

// 挂载 DM (主持人) 专用接口路由
app.use('/api/dm', dmRoutes);

// 挂载剧本创作者编辑器端接口路由 (Creator端)
app.use('/api/editor', editorRoutes);

// 根路由健康检查
app.get('/', (req, res) => {
  res.json({ message: 'Jubensha Backend API is running.', status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`[Server]: 独立后端 API 服务启动在 http://localhost:${PORT}`);
});
