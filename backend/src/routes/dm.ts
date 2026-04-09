import { Router } from 'express';
import {
  getRoomGlobalState, updateGamePhase, setPlayerStatus, distributeClue, revokeClue,
  getDmProfile, getDmSchedule, applyDmSchedule, requestDmWithdraw,
  pauseGame, resumeGame, finishGame,
  mutePlayer, muteAllPlayers, kickPlayer,
  playAudio
} from '../controllers/dmController';

const router = Router();

// =======================
// DM 个人工作台
// =======================
router.get('/profile', getDmProfile);
router.get('/schedule', getDmSchedule);
router.post('/schedule/apply', applyDmSchedule);
router.post('/withdraw', requestDmWithdraw);

// =======================
// 房间把控与上帝视角
// =======================
router.get('/rooms/:id/state', getRoomGlobalState);
router.post('/rooms/:id/phase', updateGamePhase);
router.post('/rooms/:id/pause', pauseGame);
router.post('/rooms/:id/resume', resumeGame);
router.post('/rooms/:id/finish', finishGame);

// =======================
// 玩家状态管理
// =======================
router.post('/rooms/:id/players/:playerId/status', setPlayerStatus);
router.post('/rooms/:id/players/:playerId/mute', mutePlayer);
router.post('/rooms/:id/players/mute-all', muteAllPlayers);
router.post('/rooms/:id/players/:playerId/kick', kickPlayer);

// =======================
// 线索与剧情调控
// =======================
router.post('/rooms/:id/clues/distribute', distributeClue);
router.post('/rooms/:id/clues/revoke', revokeClue);
router.post('/rooms/:id/audio/play', playAudio);

export default router;
