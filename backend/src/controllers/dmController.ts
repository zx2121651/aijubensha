import { Request, Response } from 'express';

// =======================
// 房间把控与上帝视角
// =======================
export const getRoomGlobalState = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `获取房间上帝视角全景状态 (DM) - RoomID: ${id}`, data: {} });
};

export const updateGamePhase = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `手动强制修改游戏当前阶段 (DM) - RoomID: ${id}`, status: 'success' });
};

// =======================
// 玩家状态管理
// =======================
export const setPlayerStatus = (req: Request, res: Response) => {
  const { id, playerId } = req.params;
  res.json({ message: `手动更改玩家状态 (例如禁言/踢出/死亡) (DM) - RoomID: ${id}, PlayerID: ${playerId}`, status: 'success' });
};

// =======================
// 线索与道具调控
// =======================
export const distributeClue = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `手动向指定玩家发放隐藏线索 (DM) - RoomID: ${id}`, status: 'success' });
};

export const revokeClue = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `强制收回玩家特定线索 (DM) - RoomID: ${id}`, status: 'success' });
};
