import { Router } from 'express';
import {
  getDashboardStats,
  getDashboardCharts,
  getUsers,
  getUserDetails,
  banUser,
  grantUserAsset,
  getScripts,
  createScript,
  updateScript,
  updateScriptStatus,
  getActiveRooms,
  getRoomLogs,
  dismissRoom,
  getAuditPosts,
  handleAuditPostAction,
  getAuditReviews,
  getSystemNotices,
  createSystemNotice,
  getStoreItems
} from '../controllers/adminController';

const router = Router();

// =======================
// 数据大盘模块
// =======================
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/charts', getDashboardCharts);

// =======================
// 用户管理模块
// =======================
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/grant', grantUserAsset);

// =======================
// 剧本内容管理模块
// =======================
router.get('/scripts', getScripts);
router.post('/scripts', createScript);
router.put('/scripts/:id', updateScript);
router.post('/scripts/:id/toggle-status', updateScriptStatus);

// =======================
// 房间与游戏监控模块
// =======================
router.get('/rooms/active', getActiveRooms);
router.get('/rooms/:id/logs', getRoomLogs);
router.post('/rooms/:id/dismiss', dismissRoom);

// =======================
// 社区审核模块
// =======================
router.get('/audit/posts', getAuditPosts);
router.post('/audit/posts/:id/action', handleAuditPostAction);
router.get('/audit/reviews', getAuditReviews);

// =======================
// 系统与运营配置模块
// =======================
router.get('/notices', getSystemNotices);
router.post('/notices', createSystemNotice);
router.get('/store/items', getStoreItems);

export default router;
