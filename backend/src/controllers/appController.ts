import { Request, Response } from 'express';

export const register = (req: Request, res: Response) => {
  res.json({ message: '用户注册接口 (App)', status: 'success' });
};

export const login = (req: Request, res: Response) => {
  res.json({ message: '用户登录接口 (App)', token: 'mock-jwt-token' });
};

export const getUserProfile = (req: Request, res: Response) => {
  res.json({ message: '获取用户信息接口 (App)', data: { id: 1, name: '玩家A' } });
};

export const getScripts = (req: Request, res: Response) => {
  res.json({ message: '获取剧本列表接口 (App)', data: [] });
};

export const getScriptDetail = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `获取剧本详情接口 (App) - ID: ${id}`, data: {} });
};

export const getRooms = (req: Request, res: Response) => {
  res.json({ message: '获取可加入房间列表接口 (App)', data: [] });
};

export const joinRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `加入房间接口 (App) - ID: ${id}`, status: 'success' });
};

// --- 用户模块扩展 ---
export const updateUserProfile = (req: Request, res: Response) => {
  res.json({ message: '更新个人资料接口 (App)', status: 'success' });
};

export const getUserInventory = (req: Request, res: Response) => {
  res.json({ message: '获取用户的背包道具接口 (App)', data: [] });
};

// --- 剧本模块扩展 ---
export const getScriptReviews = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `获取剧本评价列表接口 (App) - ID: ${id}`, data: [] });
};

// --- 大厅与组局模块扩展 ---
export const createRoom = (req: Request, res: Response) => {
  res.json({ message: '创建房间接口 (App)', roomId: 'room-123', status: 'success' });
};

export const leaveRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `离开房间接口 (App) - ID: ${id}`, status: 'success' });
};

// --- 社交与消息模块 ---
export const getFriendsList = (req: Request, res: Response) => {
  res.json({ message: '获取好友列表接口 (App)', data: [] });
};

export const sendFriendRequest = (req: Request, res: Response) => {
  res.json({ message: '发送好友请求接口 (App)', status: 'success' });
};

export const handleFriendRequest = (req: Request, res: Response) => {
  res.json({ message: '处理好友请求接口 (App)', status: 'success' });
};

export const getConversations = (req: Request, res: Response) => {
  res.json({ message: '获取消息会话列表接口 (App)', data: [] });
};

export const getConversationMessages = (req: Request, res: Response) => {
  const { conversationId } = req.params;
  res.json({ message: `获取特定会话历史消息接口 (App) - ID: ${conversationId}`, data: [] });
};

// --- 社区广场模块 ---
export const getPosts = (req: Request, res: Response) => {
  res.json({ message: '获取社区帖子列表接口 (App)', data: [] });
};

export const createPost = (req: Request, res: Response) => {
  res.json({ message: '发布社区帖子接口 (App)', status: 'success' });
};

export const commentOnPost = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `评论社区帖子接口 (App) - PostID: ${id}`, status: 'success' });
};

// --- 钱包与支付模块 ---
export const getWalletBalance = (req: Request, res: Response) => {
  res.json({ message: '查询钱包余额 (App)', data: { coins: 1000, balance: 50.0 } });
};
export const getWalletHistory = (req: Request, res: Response) => {
  res.json({ message: '查询账单与交易流水 (App)', data: [] });
};
export const rechargeWallet = (req: Request, res: Response) => {
  res.json({ message: '创建充值订单 (App)', orderId: 'ORD12345' });
};
export const withdrawWallet = (req: Request, res: Response) => {
  res.json({ message: '申请提现 (App)', status: 'success' });
};
export const getOrderStatus = (req: Request, res: Response) => {
  res.json({ message: '查询订单支付状态 (App)', status: 'PAID' });
};

// --- 商城与道具模块 ---
export const getStoreItems = (req: Request, res: Response) => {
  res.json({ message: '获取商城在售道具 (App)', data: [] });
};
export const buyStoreItem = (req: Request, res: Response) => {
  res.json({ message: '购买道具 (App)', status: 'success' });
};
export const giftStoreItem = (req: Request, res: Response) => {
  res.json({ message: '购买并赠送道具 (App)', status: 'success' });
};
export const redeemCode = (req: Request, res: Response) => {
  res.json({ message: '使用兑换码 (App)', status: 'success' });
};

// --- 俱乐部/公会模块 ---
export const getClubs = (req: Request, res: Response) => {
  res.json({ message: '获取公会列表 (App)', data: [] });
};
export const createClub = (req: Request, res: Response) => {
  res.json({ message: '创建公会 (App)', status: 'success' });
};
export const getClubDetail = (req: Request, res: Response) => {
  res.json({ message: '获取公会详情 (App)', data: {} });
};
export const joinClub = (req: Request, res: Response) => {
  res.json({ message: '申请加入公会 (App)', status: 'success' });
};
export const getClubMembers = (req: Request, res: Response) => {
  res.json({ message: '获取公会成员列表 (App)', data: [] });
};
export const leaveClub = (req: Request, res: Response) => {
  res.json({ message: '退出公会 (App)', status: 'success' });
};

// --- 客服与反馈 ---
export const submitSupportTicket = (req: Request, res: Response) => {
  res.json({ message: '提交工单 (App)', status: 'success' });
};
export const getSupportTickets = (req: Request, res: Response) => {
  res.json({ message: '查询工单进度 (App)', data: [] });
};
export const getFaqList = (req: Request, res: Response) => {
  res.json({ message: '获取常见问题解答 (App)', data: [] });
};
