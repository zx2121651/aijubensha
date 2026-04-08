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
