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
export const getDmProfile = async (req: Request, res: Response) => {
  const dm = await prisma.user.findUnique({ where: { id: req.query.dmId as string }, include: { hostedRooms: true } });
  res.json({ data: dm });
};
export const getDmSchedule = async (req: Request, res: Response) => {
  const schedules = await prisma.dmSchedule.findMany({ where: { dmId: req.query.dmId as string } });
  res.json({ data: schedules });
};
export const applyDmSchedule = async (req: Request, res: Response) => {
  const { dmId, startTime, endTime } = req.body;
  const schedule = await prisma.dmSchedule.create({ data: { dmId, startTime: new Date(startTime), endTime: new Date(endTime) } });
  res.json({ message: '排班申请已提交', data: schedule });
};
export const requestDmWithdraw = async (req: Request, res: Response) => {
  const { userId, amount, method, accountInfo } = req.body;
  const withdrawal = await prisma.withdrawalRequest.create({
    data: { userId, amount, method, accountInfo }
  });
  res.json({ message: '提现申请已提交，等待审核', data: withdrawal });
};
export const distributeClue = async (req: Request, res: Response) => {
  // Mock websocket event trigger
  res.json({ message: `向玩家 ${req.body.playerId} 派发线索 ${req.body.clueId}` });
};
export const revokeClue = async (req: Request, res: Response) => {
  res.json({ message: '线索已被强制回收' });
};
export const pauseGame = async (req: Request, res: Response) => {
  res.json({ message: '游戏已暂停，所有人无法操作' });
};
export const resumeGame = async (req: Request, res: Response) => {
  res.json({ message: '游戏已恢复' });
};
export const kickPlayer = async (req: Request, res: Response) => {
  await prisma.roomPlayer.delete({ where: { id: req.params.playerId } });
  res.json({ message: '玩家已被踢出' });
};
export const playAudio = async (req: Request, res: Response) => {
  res.json({ message: `开始全房间播放音频 ${req.body.audioUrl}` });
};
