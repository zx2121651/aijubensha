import { Request, Response } from 'express';

export const getDashboardStats = (req: Request, res: Response) => {
  res.json({ message: '获取大盘统计数据 (Admin)', data: { dau: 1200, revenue: 50000 } });
};

export const getUsers = (req: Request, res: Response) => {
  res.json({ message: '获取平台所有用户列表 (Admin)', data: [] });
};

export const banUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `封禁用户操作 (Admin) - ID: ${id}`, status: 'success' });
};

export const getScripts = (req: Request, res: Response) => {
  res.json({ message: '获取所有剧本管理列表 (Admin)', data: [] });
};

export const updateScriptStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `切换剧本上下架状态 (Admin) - ID: ${id}`, status: 'success' });
};

export const getActiveRooms = (req: Request, res: Response) => {
  res.json({ message: '获取当前活跃游戏房间列表 (Admin)', data: [] });
};

export const dismissRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `强制解散异常房间 (Admin) - ID: ${id}`, status: 'success' });
};
