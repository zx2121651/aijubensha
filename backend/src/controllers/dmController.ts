import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 房间把控与上帝视角
// =======================
export const getRoomGlobalState = async (req: Request, res: Response) => {
  const room = await prisma.room.findUnique({
    where: { id: req.params.id },
    include: { players: { include: { user: { select: { nickname: true } } } } }
  });
  res.json({ data: room });
};

export const updateGamePhase = async (req: Request, res: Response) => {
  const { phase } = req.body; // e.g. "DISCUSSING"
  const room = await prisma.room.update({
    where: { id: req.params.id },
    data: { phase }
  });
  res.json({ message: '阶段已修改', data: room });
};

// =======================
// 玩家状态管理
// =======================
export const setPlayerStatus = async (req: Request, res: Response) => {
  const { isDead } = req.body;
  const player = await prisma.roomPlayer.update({
    where: { id: req.params.playerId },
    data: { isDead }
  });
  res.json({ message: '玩家状态更新成功', data: player });
};

export const mutePlayer = async (req: Request, res: Response) => {
  const { isMuted } = req.body;
  const player = await prisma.roomPlayer.update({
    where: { id: req.params.playerId },
    data: { isMuted }
  });
  res.json({ message: '禁言操作成功', data: player });
};

export const muteAllPlayers = async (req: Request, res: Response) => {
  const { isMuted } = req.body;
  await prisma.roomPlayer.updateMany({
    where: { roomId: req.params.id },
    data: { isMuted }
  });
  res.json({ message: '全局禁言操作成功' });
};

export const finishGame = async (req: Request, res: Response) => {
  const room = await prisma.room.update({
    where: { id: req.params.id },
    data: { phase: 'FINISHED', finishedAt: new Date() }
  });
  res.json({ message: '游戏强行结束成功', data: room });
};

// 预留空壳接口
export const getDmProfile = (req: Request, res: Response) => res.json({ data: {} });
export const getDmSchedule = (req: Request, res: Response) => res.json({ data: [] });
export const applyDmSchedule = (req: Request, res: Response) => res.json({ status: 'success' });
export const requestDmWithdraw = (req: Request, res: Response) => res.json({ status: 'success' });
export const distributeClue = (req: Request, res: Response) => res.json({ status: 'success' });
export const revokeClue = (req: Request, res: Response) => res.json({ status: 'success' });
export const pauseGame = (req: Request, res: Response) => res.json({ status: 'success' });
export const resumeGame = (req: Request, res: Response) => res.json({ status: 'success' });
export const kickPlayer = (req: Request, res: Response) => res.json({ status: 'success' });
export const playAudio = (req: Request, res: Response) => res.json({ status: 'success' });
