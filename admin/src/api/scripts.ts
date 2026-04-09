import request from './request';

/**
 * 获取平台上架/下架的所有剧本库
 */
export const getScripts = () => {
  return request.get('/scripts');
};

/**
 * 录入新的基础剧本元数据（含难度、人数）
 */
export const createScript = (data: any) => {
  return request.post('/scripts', data);
};

/**
 * 切换前台展示的剧本上架/下架状态
 */
export const toggleScriptStatus = (id: string, status: 'PUBLISHED' | 'DRAFT') => {
  return request.post(`/scripts/${id}/toggle-status`, { status });
};

/**
 * 获取活跃中的游戏房间，用于系统监控巡查
 */
export const getActiveRooms = () => {
  return request.get('/rooms/active');
};

/**
 * 后台安全干预：强制解散异常或卡死的房间
 */
export const dismissRoom = (id: string) => {
  return request.post(`/rooms/${id}/dismiss`);
};
