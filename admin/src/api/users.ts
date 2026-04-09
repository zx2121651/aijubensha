import request from './request';

/**
 * 分页获取平台全量用户列表
 */
export const getUsers = () => {
  return request.get('/users');
};

/**
 * 查看用户详细图谱（包括历史玩本记录和账单）
 */
export const getUserDetails = (id: string) => {
  return request.get(`/users/${id}`);
};

/**
 * 封禁/解封用户账号
 */
export const banUser = (id: string) => {
  return request.post(`/users/${id}/ban`);
};

/**
 * 后台客服补偿、赠送或扣除用户虚拟资产
 */
export const grantUserAsset = (id: string, amount: number) => {
  return request.post(`/users/${id}/grant`, { amount });
};

/**
 * 获取审核或被举报社区贴列表
 */
export const getAuditPosts = () => {
  return request.get('/audit/posts');
};

/**
 * 审核通过或拒绝帖子
 */
export const handleAuditPostAction = (id: string, action: 'ACCEPTED' | 'REJECTED') => {
  return request.post(`/audit/posts/${id}/action`, { action });
};
