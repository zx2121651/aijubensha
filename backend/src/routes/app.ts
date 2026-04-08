import { Router } from 'express';
import {
  login,
  register,
  getUserProfile,
  getScripts,
  getScriptDetail,
  getRooms,
  joinRoom
} from '../controllers/appController';

const router = Router();

// =======================
// 用户与鉴权模块
// =======================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/user/profile', getUserProfile);

// =======================
// 剧本与发现模块
// =======================
router.get('/scripts', getScripts);
router.get('/scripts/:id', getScriptDetail);

// =======================
// 房间与组局模块
// =======================
router.get('/rooms', getRooms);
router.post('/rooms/:id/join', joinRoom);

// 注意：由于是模板代码，具体社交、发帖等接口结构可在此基础上扩展
export default router;
