import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 用户与鉴权模块
// =======================
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// 登录 Token 生成辅助方法，挂载了 id 和 role 身份标识
const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d'
  });
};

const registerSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入格式正确的11位手机号'),
  password: z.string().min(6, '密码长度必须至少为6个字符').max(20, '密码不能长于20个字符'),
  nickname: z.string().min(2, '昵称最少2个字符').max(10, '昵称最多10个字符')
});

export const register = catchAsync(async (req: Request, res: Response) => {
  // 1. Zod 强类型过滤校验，任何字段不符合规范会立刻抛出 ZodError 走全局错误中间件
  const validatedData = registerSchema.parse(req.body);

  // 2. 核心密码安全哈希化，盐值强度 12
  const passwordHash = await bcrypt.hash(validatedData.password, 12);

  // 3. 真实 Prisma 数据入库
  const user = await prisma.user.create({
    data: {
      phone: validatedData.phone,
      passwordHash,
      nickname: validatedData.nickname
    }
  });

  // 4. 下发签章
  const token = signToken(user.id, user.role);

  res.status(201).json({ message: '注册成功', token, user: { id: user.id, nickname: user.nickname, role: user.role } });
});

const loginSchema = z.object({
  phone: z.string(),
  password: z.string()
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { phone, password } = loginSchema.parse(req.body);

  // 验证用户在不在
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new AppError('用户账号或密码不正确', 401);
  }

  // 对比哈希密文
  const isCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrect) {
    throw new AppError('用户账号或密码不正确', 401);
  }

  // 检查如果处于封禁状态不允许发放 Token
  if (user.status === 'BANNED') {
    throw new AppError('您账号已被管理员封停，无法登入游戏', 403);
  }

  const token = signToken(user.id, user.role);
  res.json({ message: '登录成功', token, user: { id: user.id, nickname: user.nickname, role: user.role, coins: user.coins } });
});

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
export const getScripts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // 构建复合查询条件
  const where: any = { status: 'PUBLISHED' };

  if (req.query.difficulty) {
    where.difficulty = req.query.difficulty;
  }
  if (req.query.tags) {
    // tags 是包含关系查询
    where.tags = { has: req.query.tags };
  }

  const [scripts, totalCount] = await Promise.all([
    prisma.script.findMany({
      where,
      skip,
      take: limit,
      select: { id: true, title: true, cover: true, tags: true, difficulty: true, price: true }
    }),
    prisma.script.count({ where })
  ]);

  res.json({
    message: '剧本获取成功',
    data: scripts,
    pagination: { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) }
  });
});

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

// =======================
// 推荐匹配辅助方法
// =======================
const getPlayedAndOwnedScriptIds = async (userId: string): Promise<string[]> => {
  const roomPlayers = await prisma.roomPlayer.findMany({
    where: { userId },
    include: { room: { select: { scriptId: true } } }
  });
  const playedScriptIds = roomPlayers.map(rp => rp.room.scriptId);

  const reviews = await prisma.scriptReview.findMany({
    where: { userId }
  });
  const reviewedScriptIds = reviews.map(r => r.scriptId);

  const filterIds = new Set([...playedScriptIds, ...reviewedScriptIds]);
  return Array.from(filterIds);
};

export const getRooms = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // 仅当用户登录时应用智能推荐

  let playedScriptIds: string[] = [];
  let userFriends: string[] = [];
  let userClubs: string[] = [];

  if (userId) {
    // 1. 获取防剧透过滤列表
    playedScriptIds = await getPlayedAndOwnedScriptIds(userId);

    // 2. 获取社交关系网，用于社交加权打分
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'ACCEPTED'
      }
    });
    userFriends = friends.map(f => f.senderId === userId ? f.receiverId : f.senderId);

    const clubMemberships = await prisma.clubMember.findMany({
      where: { userId }
    });
    const clubIds = clubMemberships.map(c => c.clubId);

    const sameClubMembers = await prisma.clubMember.findMany({
      where: { clubId: { in: clubIds } }
    });
    userClubs = sameClubMembers.map(c => c.userId);
  }

  // 3. 执行数据库级过滤 (Hard Filter)
  const rooms = await prisma.room.findMany({
    where: {
      phase: 'RECRUITING',
      isPrivate: false,
      scriptId: userId ? { notIn: playedScriptIds } : undefined
    },
    include: {
      script: { select: { id: true, title: true, minPlayers: true, maxPlayers: true, difficulty: true } },
      players: { select: { userId: true } },
      _count: { select: { players: true } }
    }
  });

  // 4. 内存中进行加权打分 (Scoring) 与排序
  const scoredRooms = rooms
    .filter(room => room._count.players < room.script.maxPlayers) // 二次过滤已满房间
    .map(room => {
      let score = 0;
      const currentCount = room._count.players;
      const minPlayers = room.script.minPlayers;

      // a) 发车效率权重 (Max 50): 缺的人越少，分数越高
      if (currentCount > 0) {
        const fillRatio = currentCount / minPlayers;
        score += Math.min(fillRatio * 50, 50); // 若达到甚至超过 minPlayers，给予满分 50
      }

      // b) 社交加成权重 (Max 30)
      if (userId) {
        let hasFriend = false;
        let hasClubmate = false;

        for (const p of room.players) {
          if (userFriends.includes(p.userId)) hasFriend = true;
          if (userClubs.includes(p.userId) && p.userId !== userId) hasClubmate = true;
        }

        if (hasFriend) score += 20;
        if (hasClubmate) score += 10;
      }

      // c) 随机波动微调，避免相同分数长期霸榜 (0~5分)
      score += Math.random() * 5;

      return {
        ...room,
        matchScore: parseFloat(score.toFixed(2))
      };
    });

  // 按得分从高到低排序
  scoredRooms.sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    status: 'success',
    data: scoredRooms,
    message: userId ? '已启用智能防剧透排车推荐' : '默认大厅列表'
  });
});

export const autoMatchRoom = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  // 1. 获取防剧透过滤列表
  const playedScriptIds = await getPlayedAndOwnedScriptIds(userId);

  // 2. 查询社交网
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }], status: 'ACCEPTED' }
  });
  const userFriends = friends.map(f => f.senderId === userId ? f.receiverId : f.senderId);

  const clubMemberships = await prisma.clubMember.findMany({ where: { userId } });
  const clubIds = clubMemberships.map(c => c.clubId);
  const sameClubMembers = await prisma.clubMember.findMany({ where: { clubId: { in: clubIds } } });
  const userClubs = sameClubMembers.map(c => c.userId);

  // 3. 取出可选房间
  const rooms = await prisma.room.findMany({
    where: {
      phase: 'RECRUITING',
      isPrivate: false,
      scriptId: { notIn: playedScriptIds }
    },
    include: {
      script: { select: { id: true, title: true, minPlayers: true, maxPlayers: true } },
      players: { select: { userId: true } },
      _count: { select: { players: true } }
    }
  });

  // 4. 打分排序寻找 Top 1
  const validRooms = rooms.filter(r => r._count.players < r.script.maxPlayers);
  if (validRooms.length === 0) {
    throw new AppError('当前大厅内没有合适您的房间，请稍后再试或自己建个房间', 404);
  }

  let bestRoom = null;
  let maxScore = -1;

  for (const room of validRooms) {
    let score = 0;
    const fillRatio = room._count.players / room.script.minPlayers;
    score += Math.min(fillRatio * 50, 50);

    let hasFriend = false;
    let hasClubmate = false;
    for (const p of room.players) {
      if (userFriends.includes(p.userId)) hasFriend = true;
      if (userClubs.includes(p.userId) && p.userId !== userId) hasClubmate = true;
    }
    if (hasFriend) score += 20;
    if (hasClubmate) score += 10;
    score += Math.random() * 5;

    if (score > maxScore) {
      maxScore = score;
      bestRoom = room;
    }
  }

  if (!bestRoom) {
    throw new AppError('未能找到匹配的房间', 404);
  }

  // 5. 将用户加入该得分最高的房间 (事务防止并发超员)
  const result = await prisma.$transaction(async (tx) => {
    // 重新校验当前人数
    const targetRoom = await tx.room.findUnique({
      where: { id: bestRoom!.id },
      include: { script: true, _count: { select: { players: true } } }
    });

    if (!targetRoom || targetRoom._count.players >= targetRoom.script.maxPlayers) {
      throw new AppError('匹配的房间刚被抢先加入了，请重新匹配', 409);
    }

    const playerRecord = await tx.roomPlayer.create({
      data: {
        roomId: bestRoom!.id,
        userId
      }
    });

    return { targetRoom, playerRecord };
  });

  res.status(200).json({
    status: 'success',
    message: '一键匹配成功，已为您加入车队！',
    data: {
      roomId: bestRoom.id,
      roomName: bestRoom.name,
      scriptTitle: bestRoom.script.title,
      matchScore: parseFloat(maxScore.toFixed(2))
    }
  });
});

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

const rechargeSchema = z.object({ amount: z.number().min(1, '充值金额不能少于 1 元').max(10000, '单次充值不能超1万') });

export const rechargeWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // 已被鉴权层 authMiddleware 挂载
  const { amount } = rechargeSchema.parse(req.body);

  // 生成并完成充值订单事务
  const result = await prisma.$transaction([
    prisma.order.create({ data: { userId, type: 'RECHARGE', amount, status: 'PAID' } }),
    prisma.user.update({ where: { id: userId }, data: { coins: { increment: amount * 10 } } })
  ]);

  res.json({ message: '充值成功', order: result[0] });
});

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
export const getStoreItems = async (req: Request, res: Response) => {
  const items = await prisma.storeItem.findMany({ where: { isActive: true } });
  res.json({ data: items });
};
export const buyStoreItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // req.user provided by protect middleware
  const { itemId } = req.body;

  if (!itemId) throw new AppError('请选择你要购买的道具', 400);

  const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
  if (!item || !item.isActive) {
    throw new AppError('该商品不存在或已下架', 404);
  }

  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (currentUser!.coins < item.price) {
    throw new AppError('您的金币不足，请先充值', 400); // 业务层拦截，防止数据库爆雷
  }

  // 此时余额必然足够，执行最终扣减操作与流水生成
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { coins: { decrement: item.price } } }),
    prisma.order.create({ data: { userId, type: 'ITEM_BUY', amount: item.price, status: 'PAID', description: `Buy ${item.name}` } })
  ]);

  res.json({ message: '购买成功', status: 'success' });
});
export const giftStoreItem = async (req: Request, res: Response) => {
  const { senderId, receiverId, itemId } = req.body;
  const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
  if (!item) return res.status(404).json({ error: 'Item not found' });

  await prisma.$transaction([
    prisma.user.update({ where: { id: senderId }, data: { coins: { decrement: item.price } } }),
    prisma.order.create({ data: { userId: senderId, type: 'ITEM_BUY', amount: item.price, status: 'PAID', description: `Gift ${item.name} to ${receiverId}` } })
  ]);
  res.json({ message: '赠送成功', status: 'success' });
};
export const redeemCode = async (req: Request, res: Response) => {
  const { userId, code } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { code, isUsed: false } });
  if (!coupon || coupon.validUntil < new Date()) return res.status(400).json({ error: '兑换码无效或已过期' });

  await prisma.$transaction([
    prisma.coupon.update({ where: { id: coupon.id }, data: { isUsed: true, userId } }),
    prisma.user.update({ where: { id: userId }, data: { balance: { increment: coupon.discount } } })
  ]);
  res.json({ message: '兑换成功', discount: coupon.discount });
};
export const getClubMembers = async (req: Request, res: Response) => {
  const members = await prisma.clubMember.findMany({
    where: { clubId: req.params.id },
    include: { user: { select: { nickname: true, avatar: true } } }
  });
  res.json({ data: members });
};
export const leaveClub = async (req: Request, res: Response) => {
  await prisma.clubMember.deleteMany({
    where: { clubId: req.params.id, userId: req.body.userId }
  });
  res.json({ message: '成功退出公会', status: 'success' });
};
export const submitSupportTicket = async (req: Request, res: Response) => {
  const { userId, type, content } = req.body;
  const ticket = await prisma.supportTicket.create({
    data: { userId, type, content }
  });
  res.json({ message: '工单已提交', data: ticket });
};
export const getSupportTickets = async (req: Request, res: Response) => {
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: req.query.userId as string },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ data: tickets });
};
export const getFaqList = async (req: Request, res: Response) => {
  const faqs = await prisma.faq.findMany({ orderBy: { orderIndex: 'asc' } });
  res.json({ data: faqs });
};
