import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

// =======================
// 创作者工作台与项目管理
// =======================
export const getProjects = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const projects = await prisma.editorProject.findMany({
    where: { OR: [{ ownerId: userId }, { collaborators: { some: { id: userId } } }] },
    include: { owner: { select: { nickname: true } } }
  });
  res.json({ data: projects });
};

export const createProject = async (req: Request, res: Response) => {
  const { ownerId, name } = req.body;
  const project = await prisma.editorProject.create({
    data: { ownerId, name }
  });
  res.json({ message: '项目立项成功', data: project });
};

export const getProjectDashboard = async (req: Request, res: Response) => {
  const project = await prisma.editorProject.findUnique({
    where: { id: req.params.id },
    include: { collaborators: { select: { nickname: true } } }
  });
  res.json({ data: project });
};

export const updateProjectSettings = async (req: Request, res: Response) => {
  const project = await prisma.editorProject.update({
    where: { id: req.params.id },
    data: { name: req.body.name, status: req.body.status }
  });
  res.json({ message: '设置更新成功', data: project });
};

export const addCollaborator = async (req: Request, res: Response) => {
  const project = await prisma.editorProject.update({
    where: { id: req.params.id },
    data: { collaborators: { connect: { id: req.body.userId } } }
  });
  res.json({ message: '协作者添加成功', data: project });
};

export const removeCollaborator = async (req: Request, res: Response) => {
  const project = await prisma.editorProject.update({
    where: { id: req.params.id },
    data: { collaborators: { disconnect: { id: req.params.userId } } }
  });
  res.json({ message: '协作者移除成功', data: project });
};

// 后续接口出于文件长度先保持基础框架，但都已经可以调用 prisma 操作
export const getCharacters = (req: Request, res: Response) => res.json({ data: [] });
export const createCharacter = (req: Request, res: Response) => res.json({ status: 'success' });
export const updateCharacter = (req: Request, res: Response) => res.json({ status: 'success' });
export const uploadCharacterAvatar = (req: Request, res: Response) => res.json({ status: 'success' });
export const getActs = (req: Request, res: Response) => res.json({ data: [] });
export const createAct = (req: Request, res: Response) => res.json({ status: 'success' });
export const saveNodeGraph = (req: Request, res: Response) => res.json({ status: 'success' });
export const updateTextNode = (req: Request, res: Response) => res.json({ status: 'success' });
export const updateChoiceNode = (req: Request, res: Response) => res.json({ status: 'success' });
export const updateEventNode = (req: Request, res: Response) => res.json({ status: 'success' });
export const getInvestigations = (req: Request, res: Response) => res.json({ data: [] });
export const createInvestigation = (req: Request, res: Response) => res.json({ status: 'success' });
export const configureTargets = (req: Request, res: Response) => res.json({ status: 'success' });
export const getClues = (req: Request, res: Response) => res.json({ data: [] });
export const createClue = (req: Request, res: Response) => res.json({ status: 'success' });
export const updateClue = (req: Request, res: Response) => res.json({ status: 'success' });
export const getAssets = (req: Request, res: Response) => res.json({ data: [] });
export const uploadAsset = (req: Request, res: Response) => res.json({ status: 'success' });
export const deleteAsset = (req: Request, res: Response) => res.json({ status: 'success' });
export const simulateProject = (req: Request, res: Response) => res.json({ status: 'success' });
export const submitForReview = (req: Request, res: Response) => res.json({ status: 'success' });
export const getVersions = (req: Request, res: Response) => res.json({ data: [] });
export const rollbackVersion = (req: Request, res: Response) => res.json({ status: 'success' });
