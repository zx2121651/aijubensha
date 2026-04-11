import request from './request';

/**
 * 获取当前大厅招募的房间列表
 */
export const getRooms = () => {
  return request.get('/rooms');
};

/**
 * 创建新房间
 */
export const createRoom = (data: { scriptId: string, hostDmId?: string, name: string, isPrivate: boolean }) => {
  return request.post('/rooms/create', data);
};

/**
 * 玩家加入房间
 */
export const joinRoom = (roomId: string, userId: string) => {
  return request.post(`/rooms/${roomId}/join`, { userId });
};

/**
 * 玩家离开房间
 */
export const leaveRoom = (roomId: string) => {
  return request.post(`/rooms/${roomId}/leave`);
};

/**
 * 剧本浏览接口
 */
export const getScripts = () => {
  return request.get('/scripts');
};

export const getScriptDetail = (id: string) => {
  return request.get(`/scripts/${id}`);
};

export const getScriptReviews = (id: string) => {
  return request.get(`/scripts/${id}/reviews`);
};

/**
 * 一键智能匹配入局
 */
export const autoMatchRoom = () => {
  return request.post('/rooms/automatch');
};
