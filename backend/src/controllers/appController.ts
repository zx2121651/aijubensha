import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 用户与鉴权模块
// =======================
export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, nickname } = req.body;
    // 模拟密码哈希处理
    const passwordHash = Buffer.from(password || '123456').toString('base64');

    const user = await prisma.user.create({
      data: { phone, passwordHash, nickname }
    });
    res.json({ message: '注册成功', user });
  } catch (error) {
    res.status(500).json({ error: '注册失败，可能手机号已存在' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ error: '用户不存在' });

    // 模拟 Token 签发
    const token = `jwt-token-${user.id}`;
    res.json({ message: '登录成功', token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: '登录发生异常' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  // 假定通过中间件注入了 userId
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, nickname: true, avatar: true, coins: true, role: true }
  });
  res.json({ data: user });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { nickname, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { nickname, avatar }
  });
  res.json({ message: '更新成功', data: user });
};

export const getUserInventory = async (req: Request, res: Response) => {
  res.json({ message: '获取用户的背包道具接口 (App)', data: [] });
};

// =======================
// 剧本与发现模块
// =======================
export const getScripts = async (req: Request, res: Response) => {
  const scripts = await prisma.script.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, cover: true, tags: true, difficulty: true }
  });
  res.json({ data: scripts });
};

export const getScriptDetail = async (req: Request, res: Response) => {
  const script = await prisma.script.findUnique({
    where: { id: req.params.id },
    include: { characters: true }
  });
  res.json({ data: script });
};

export const getScriptReviews = async (req: Request, res: Response) => {
  const reviews = await prisma.scriptReview.findMany({
    where: { scriptId: req.params.id, status: 'APPROVED' },
    include: { script: { select: { title: true } } }
  });
  res.json({ data: reviews });
};

// =======================
// 大厅与组局模块
// =======================
export const getRooms = async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    where: { phase: 'RECRUITING', isPrivate: false },
    include: { script: true, _count: { select: { players: true } } }
  });
  res.json({ data: rooms });
};

export const createRoom = async (req: Request, res: Response) => {
  const { scriptId, hostDmId, name, isPrivate } = req.body;
  const room = await prisma.room.create({
    data: { scriptId, hostDmId, name, isPrivate }
  });
  res.json({ message: '创建房间成功', data: room });
};

export const joinRoom = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const roomPlayer = await prisma.roomPlayer.create({
    data: { roomId: req.params.id, userId }
  });
  res.json({ message: '加入房间成功', data: roomPlayer });
};

export const leaveRoom = async (req: Request, res: Response) => {
  // 真实实现需要处理玩家退出、房主转移或房间解散
  res.json({ message: `离开房间接口 (App)`, status: 'success' });
};

// =======================
// 社交与消息模块
// =======================
export const getFriendsList = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }], status: 'ACCEPTED' },
    include: { sender: true, receiver: true }
  });
  res.json({ data: friends });
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;
  const request = await prisma.friendship.create({
    data: { senderId, receiverId }
  });
  res.json({ message: '好友请求已发送', data: request });
};

export const handleFriendRequest = async (req: Request, res: Response) => {
  const { requestId, action } = req.body; // action: ACCEPTED or REJECTED
  const request = await prisma.friendship.update({
    where: { id: requestId },
    data: { status: action }
  });
  res.json({ message: '处理成功', data: request });
};

export const getConversations = (req: Request, res: Response) => res.json({ data: [] });
export const getConversationMessages = (req: Request, res: Response) => res.json({ data: [] });

// =======================
// 社区广场模块
// =======================
export const getPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: { status: 'APPROVED' },
    include: { author: { select: { nickname: true, avatar: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ data: posts });
};

export const createPost = async (req: Request, res: Response) => {
  const { authorId, title, content } = req.body;
  const post = await prisma.post.create({ data: { authorId, title, content } });
  res.json({ message: '发布成功', data: post });
};

export const commentOnPost = async (req: Request, res: Response) => {
  const { authorId, content } = req.body;
  const comment = await prisma.postComment.create({
    data: { postId: req.params.id, authorId, content }
  });
  res.json({ message: '评论成功', data: comment });
};

// =======================
// 钱包与支付模块 (Transactions)
// =======================
export const getWalletBalance = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { coins: true, balance: true } });
  res.json({ data: user });
};

export const rechargeWallet = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  // 使用 Prisma 事务保证订单创建与余额更新的一致性
  const result = await prisma.$transaction([
    prisma.order.create({ data: { userId, type: 'RECHARGE', amount, status: 'PAID' } }),
    prisma.user.update({ where: { id: userId }, data: { coins: { increment: amount * 10 } } })
  ]);

  res.json({ message: '充值成功', order: result[0] });
};

export const getWalletHistory = (req: Request, res: Response) => res.json({ data: [] });
export const withdrawWallet = (req: Request, res: Response) => res.json({ status: 'success' });
export const getOrderStatus = (req: Request, res: Response) => res.json({ status: 'PAID' });

// =======================
// 俱乐部/公会模块
// =======================
export const getClubs = async (req: Request, res: Response) => {
  const clubs = await prisma.club.findMany({ include: { _count: { select: { members: true } } } });
  res.json({ data: clubs });
};

export const createClub = async (req: Request, res: Response) => {
  const { name, creatorId } = req.body;
  const club = await prisma.club.create({
    data: { name, creatorId, members: { create: { userId: creatorId, role: 'PRESIDENT' } } }
  });
  res.json({ message: '公会创建成功', data: club });
};

export const getClubDetail = async (req: Request, res: Response) => {
  const club = await prisma.club.findUnique({ where: { id: req.params.id }, include: { members: { include: { user: true } } } });
  res.json({ data: club });
};

export const joinClub = async (req: Request, res: Response) => {
  const membership = await prisma.clubMember.create({
    data: { clubId: req.params.id, userId: req.body.userId }
  });
  res.json({ message: '成功加入', data: membership });
};

// 预留未完全实现的空壳接口
export const getStoreItems = (req: Request, res: Response) => res.json({ data: [] });
export const buyStoreItem = (req: Request, res: Response) => res.json({ status: 'success' });
export const giftStoreItem = (req: Request, res: Response) => res.json({ status: 'success' });
export const redeemCode = (req: Request, res: Response) => res.json({ status: 'success' });
export const getClubMembers = (req: Request, res: Response) => res.json({ data: [] });
export const leaveClub = (req: Request, res: Response) => res.json({ status: 'success' });
export const submitSupportTicket = (req: Request, res: Response) => res.json({ status: 'success' });
export const getSupportTickets = (req: Request, res: Response) => res.json({ data: [] });
export const getFaqList = (req: Request, res: Response) => res.json({ data: [] });
