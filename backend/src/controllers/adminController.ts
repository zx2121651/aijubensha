import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 数据大盘模块
// =======================
export const getDashboardStats = async (req: Request, res: Response) => {
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
};

export const getDashboardCharts = (req: Request, res: Response) => res.json({ data: [] });

// =======================
// 用户管理模块
// =======================
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, nickname: true, phone: true, role: true, status: true, createdAt: true }
  });
  res.json({ data: users });
};

export const getUserDetails = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { playedRooms: true, orders: true } } }
  });
  res.json({ data: user });
};

export const banUser = async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: 'BANNED' }
  });
  res.json({ message: '用户已封禁', data: user });
};

export const grantUserAsset = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { coins: { increment: amount } }
  });
  res.json({ message: '资产发放成功', data: user });
};

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
export const getAuditReviews = (req: Request, res: Response) => res.json({ data: [] });
export const getSystemNotices = (req: Request, res: Response) => res.json({ data: [] });
export const createSystemNotice = (req: Request, res: Response) => res.json({ status: 'success' });
export const getStoreItems = (req: Request, res: Response) => res.json({ data: [] });
export const getRoles = (req: Request, res: Response) => res.json({ data: [] });
export const manageRoles = (req: Request, res: Response) => res.json({ status: 'success' });
export const getManagers = (req: Request, res: Response) => res.json({ data: [] });
export const manageManagers = (req: Request, res: Response) => res.json({ status: 'success' });
export const getFinanceOrders = (req: Request, res: Response) => res.json({ data: [] });
export const refundOrder = (req: Request, res: Response) => res.json({ status: 'success' });
export const getWithdrawals = (req: Request, res: Response) => res.json({ data: [] });
export const auditWithdrawal = (req: Request, res: Response) => res.json({ status: 'success' });
export const getBanners = (req: Request, res: Response) => res.json({ data: [] });
export const updateBanners = (req: Request, res: Response) => res.json({ status: 'success' });
export const getCoupons = (req: Request, res: Response) => res.json({ data: [] });
export const issueCoupons = (req: Request, res: Response) => res.json({ status: 'success' });
export const getSystemLogs = (req: Request, res: Response) => res.json({ data: [] });
export const getSystemErrors = (req: Request, res: Response) => res.json({ data: [] });
