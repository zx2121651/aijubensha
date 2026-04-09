import { Router } from 'express';
import {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getUserInventory,
  getScripts,
  getScriptDetail,
  getScriptReviews,
  getRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  getFriendsList,
  sendFriendRequest,
  handleFriendRequest,
  getConversations,
  getConversationMessages,
  getPosts,
  createPost,
  commentOnPost
} from '../controllers/appController';

const router = Router();

// =======================
// 用户与鉴权模块
// =======================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/user/profile', getUserProfile);
router.put('/user/profile', updateUserProfile);
router.get('/user/inventory', getUserInventory);

// =======================
// 剧本与发现模块
// =======================
router.get('/scripts', getScripts);
router.get('/scripts/:id', getScriptDetail);
router.get('/scripts/:id/reviews', getScriptReviews);

// =======================
// 大厅与组局模块
// =======================
router.get('/rooms', getRooms);
router.post('/rooms/create', createRoom);
router.post('/rooms/:id/join', joinRoom);
router.post('/rooms/:id/leave', leaveRoom);

// =======================
// 社交与消息模块
// =======================
router.get('/friends', getFriendsList);
router.post('/friends/request', sendFriendRequest);
router.post('/friends/handle', handleFriendRequest);
router.get('/messages/conversations', getConversations);
router.get('/messages/:conversationId', getConversationMessages);

// =======================
// 社区广场模块
// =======================
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.post('/posts/:id/comment', commentOnPost);

export default router;
