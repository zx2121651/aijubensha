import { Router } from 'express';
import {
  login, register, getUserProfile, updateUserProfile, getUserInventory,
  getScripts, getScriptDetail, getScriptReviews, getRooms, createRoom, joinRoom, leaveRoom,
  getFriendsList, sendFriendRequest, handleFriendRequest, getConversations, getConversationMessages,
  getPosts, createPost, commentOnPost,
  getWalletBalance, getWalletHistory, rechargeWallet, withdrawWallet, getOrderStatus,
  getStoreItems, buyStoreItem, giftStoreItem, redeemCode,
  getClubs, createClub, getClubDetail, joinClub, getClubMembers, leaveClub,
  submitSupportTicket, getSupportTickets, getFaqList
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

// =======================
// 钱包与支付模块
// =======================
router.get('/wallet/balance', getWalletBalance);
router.get('/wallet/history', getWalletHistory);
router.post('/wallet/recharge', rechargeWallet);
router.post('/wallet/withdraw', withdrawWallet);
router.get('/wallet/order/:id', getOrderStatus);

// =======================
// 商城与道具模块
// =======================
router.get('/store/items', getStoreItems);
router.post('/store/buy', buyStoreItem);
router.post('/store/gift', giftStoreItem);
router.post('/store/redeem', redeemCode);

// =======================
// 俱乐部/公会模块
// =======================
router.get('/clubs', getClubs);
router.post('/clubs/create', createClub);
router.get('/clubs/:id', getClubDetail);
router.post('/clubs/:id/join', joinClub);
router.get('/clubs/:id/members', getClubMembers);
router.post('/clubs/:id/leave', leaveClub);

// =======================
// 客服与反馈
// =======================
router.post('/support/tickets', submitSupportTicket);
router.get('/support/tickets', getSupportTickets);
router.get('/support/faq', getFaqList);

export default router;
