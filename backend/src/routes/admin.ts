import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  banUser,
  getScripts,
  updateScriptStatus,
  getActiveRooms,
  dismissRoom
} from '../controllers/adminController';

const router = Router();

// =======================
// 数据大盘模块
// =======================
router.get('/dashboard/stats', getDashboardStats);

// =======================
// 用户管理模块
// =======================
router.get('/users', getUsers);
router.post('/users/:id/ban', banUser);

// =======================
// 剧本内容管理模块
// =======================
router.get('/scripts', getScripts);
router.post('/scripts/:id/toggle-status', updateScriptStatus);

// =======================
// 房间与游戏监控模块
// =======================
router.get('/rooms/active', getActiveRooms);
router.post('/rooms/:id/dismiss', dismissRoom);

// 注意：由于是模板代码，后续的审核、系统配置等接口可在此扩展
export default router;
