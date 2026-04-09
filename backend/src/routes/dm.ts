import { Router } from 'express';
import {
  getRoomGlobalState,
  updateGamePhase,
  setPlayerStatus,
  distributeClue,
  revokeClue
} from '../controllers/dmController';

const router = Router();

// 房间把控与上帝视角
router.get('/rooms/:id/state', getRoomGlobalState);
router.post('/rooms/:id/phase', updateGamePhase);

// 玩家状态管理
router.post('/rooms/:id/players/:playerId/status', setPlayerStatus);

// 线索与道具调控
router.post('/rooms/:id/clues/distribute', distributeClue);
router.post('/rooms/:id/clues/revoke', revokeClue);

export default router;
