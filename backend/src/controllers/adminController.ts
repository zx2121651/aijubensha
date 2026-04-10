import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 数据大盘模块
// =======================
export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const [userCount, roomCount, orderTotal] = await Promise.all([
    prisma.user.count(),
    prisma.room.count({ where: { NOT: { phase: 'FINISHED' } } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } })
  ]);

  res.json({
    message: '大盘统计',
    data: {
      totalUsers: userCount,
      activeRooms: roomCount,
      totalRevenue: orderTotal._sum.amount || 0
    }
  });
});

export const getDashboardCharts = (req: Request, res: Response) => res.json({ data: [] });

// =======================
// 用户管理模块
// =======================
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;

  const where: any = {};
  if (search) {
    where.OR = [
      { nickname: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, nickname: true, phone: true, role: true, status: true, createdAt: true, coins: true, balance: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  res.json({
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

export const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { playedRooms: true, orders: true } } }
  });
  res.json({ data: user });
});

export const banUser = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: 'BANNED' }
  });
  res.json({ message: '用户已封禁', data: user });
});

export const grantUserAsset = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { coins: { increment: amount } }
  });
  res.json({ message: '资产发放成功', data: user });
});

// =======================
// 剧本内容管理模块
// =======================
export const getScripts = async (req: Request, res: Response) => {
  const scripts = await prisma.script.findMany();
  res.json({ data: scripts });
};

export const createScript = async (req: Request, res: Response) => {
  const script = await prisma.script.create({ data: req.body });
  res.json({ message: '剧本录入成功', data: script });
};

export const updateScript = async (req: Request, res: Response) => {
  const script = await prisma.script.update({ where: { id: req.params.id }, data: req.body });
  res.json({ message: '剧本更新成功', data: script });
};

export const updateScriptStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const script = await prisma.script.update({ where: { id: req.params.id }, data: { status } });
  res.json({ message: '状态切换成功', data: script });
};

// =======================
// 房间与游戏监控模块
// =======================
export const getActiveRooms = async (req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    where: { NOT: { phase: 'FINISHED' } },
    include: { script: { select: { title: true } }, hostDm: { select: { nickname: true } } }
  });
  res.json({ data: rooms });
};

export const dismissRoom = async (req: Request, res: Response) => {
  const room = await prisma.room.update({
    where: { id: req.params.id },
    data: { phase: 'FINISHED', finishedAt: new Date() }
  });
  res.json({ message: '房间强制解散成功', data: room });
};

export const getRoomLogs = (req: Request, res: Response) => res.json({ data: [] });

// =======================
// 社区审核模块
// =======================
export const getAuditPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ where: { status: 'PENDING' } });
  res.json({ data: posts });
};

export const handleAuditPostAction = async (req: Request, res: Response) => {
  const { action } = req.body;
  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: { status: action } // ACCEPTED / REJECTED
  });
  res.json({ message: '审核操作成功', data: post });
};

// 预留未完全实现的空壳接口
export const getAuditReviews = async (req: Request, res: Response) => {
  const reviews = await prisma.scriptReview.findMany({ where: { status: 'PENDING' }, include: { script: true } });
  res.json({ data: reviews });
};
export const getSystemNotices = async (req: Request, res: Response) => {
  const notices = await prisma.systemNotice.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ data: notices });
};
export const createSystemNotice = async (req: Request, res: Response) => {
  const notice = await prisma.systemNotice.create({ data: req.body });
  res.json({ message: '公告已发布', data: notice });
};
export const getStoreItems = async (req: Request, res: Response) => {
  const items = await prisma.storeItem.findMany();
  res.json({ data: items });
};
export const getRoles = async (req: Request, res: Response) => {
  const roles = await prisma.roleConfig.findMany();
  res.json({ data: roles });
};
export const manageRoles = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;
  const role = await prisma.roleConfig.upsert({
    where: { name },
    update: { permissions },
    create: { name, permissions }
  });
  res.json({ message: '角色配置保存成功', data: role });
};
export const getManagers = async (req: Request, res: Response) => {
  const managers = await prisma.user.findMany({ where: { OR: [{ role: 'ADMIN' }, { role: 'SUPER_ADMIN' }] } });
  res.json({ data: managers });
};
export const manageManagers = async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.body.userId },
    data: { role: req.body.role }
  });
  res.json({ message: '管理员授权成功', data: user });
};
export const getFinanceOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ include: { user: { select: { nickname: true } } }, orderBy: { createdAt: 'desc' } });
  res.json({ data: orders });
};
export const refundOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order || order.status !== 'PAID') return res.status(400).json({ error: '订单无法退款' });

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: 'REFUNDED' } }),
    prisma.user.update({ where: { id: order.userId }, data: { coins: { decrement: order.amount * 10 } } })
  ]);
  res.json({ message: '退款处理成功' });
};
export const getWithdrawals = async (req: Request, res: Response) => {
  const items = await prisma.withdrawalRequest.findMany({ include: { user: { select: { nickname: true } } } });
  res.json({ data: items });
};
export const auditWithdrawal = async (req: Request, res: Response) => {
  const request = await prisma.withdrawalRequest.update({
    where: { id: req.params.id },
    data: { status: req.body.status } // APPROVED / REJECTED
  });
  res.json({ message: '提现审批完成', data: request });
};
export const getBanners = async (req: Request, res: Response) => {
  const banners = await prisma.banner.findMany();
  res.json({ data: banners });
};
export const updateBanners = async (req: Request, res: Response) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.json({ message: 'Banner添加成功', data: banner });
};
export const getCoupons = async (req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany();
  res.json({ data: coupons });
};
export const issueCoupons = async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.create({ data: req.body });
  res.json({ message: '优惠券下发成功', data: coupon });
};
export const getSystemLogs = async (req: Request, res: Response) => {
  const logs = await prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json({ data: logs });
};
export const getSystemErrors = async (req: Request, res: Response) => {
  const errors = await prisma.systemError.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json({ data: errors });
};
