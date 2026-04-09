import { Router } from 'express';
import {
  getProjects, createProject, getProjectDashboard, updateProjectSettings, addCollaborator, removeCollaborator,
  getCharacters, createCharacter, updateCharacter, uploadCharacterAvatar,
  getActs, createAct, saveNodeGraph, updateTextNode, updateChoiceNode, updateEventNode,
  getInvestigations, createInvestigation, configureTargets, getClues, createClue, updateClue,
  getAssets, uploadAsset, deleteAsset,
  simulateProject, submitForReview, getVersions, rollbackVersion
} from '../controllers/editorController';

const router = Router();

// =======================
// 创作者工作台与项目管理
// =======================
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id/dashboard', getProjectDashboard);
router.put('/projects/:id/settings', updateProjectSettings);
router.post('/projects/:id/collaborators', addCollaborator);
router.delete('/projects/:id/collaborators/:userId', removeCollaborator);

// =======================
// 人物与角色配置
// =======================
router.get('/projects/:id/characters', getCharacters);
router.post('/projects/:id/characters', createCharacter);
router.put('/projects/:id/characters/:charId', updateCharacter);
router.post('/projects/:id/characters/:charId/avatar', uploadCharacterAvatar);

// =======================
// 剧本内容与节点编排
// =======================
router.get('/projects/:id/acts', getActs);
router.post('/projects/:id/acts', createAct);
router.put('/projects/:id/acts/:actId/nodes', saveNodeGraph);
router.post('/projects/:id/nodes/text', updateTextNode);
router.post('/projects/:id/nodes/choice', updateChoiceNode);
router.post('/projects/:id/nodes/event', updateEventNode);

// =======================
// 搜证与线索系统
// =======================
router.get('/projects/:id/investigations', getInvestigations);
router.post('/projects/:id/investigations', createInvestigation);
router.post('/projects/:id/investigations/:invId/targets', configureTargets);
router.get('/projects/:id/clues', getClues);
router.post('/projects/:id/clues', createClue);
router.put('/projects/:id/clues/:clueId', updateClue);

// =======================
// 多媒体素材管理
// =======================
router.get('/projects/:id/assets', getAssets);
router.post('/projects/:id/assets/upload', uploadAsset);
router.delete('/projects/:id/assets/:assetId', deleteAsset);

// =======================
// 测试与发行
// =======================
router.post('/projects/:id/simulate', simulateProject);
router.post('/projects/:id/publish-review', submitForReview);
router.get('/projects/:id/versions', getVersions);
router.post('/projects/:id/rollback', rollbackVersion);

export default router;
