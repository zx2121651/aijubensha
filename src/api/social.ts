import request from './request';

/**
 * 社区论坛帖子模块
 */
export const getPosts = () => {
  return request.get('/posts');
};

export const createPost = (data: { authorId: string, title: string, content: string }) => {
  return request.post('/posts', data);
};

export const commentOnPost = (postId: string, data: { authorId: string, content: string }) => {
  return request.post(`/posts/${postId}/comment`, data);
};

/**
 * 好友与消息模块
 */
export const getFriendsList = (userId: string) => {
  return request.get('/friends', { params: { userId } });
};

export const sendFriendRequest = (data: { senderId: string, receiverId: string }) => {
  return request.post('/friends/request', data);
};

export const handleFriendRequest = (data: { requestId: string, action: 'ACCEPTED' | 'REJECTED' }) => {
  return request.post('/friends/handle', data);
};

export const getConversations = () => {
  return request.get('/messages/conversations');
};

export const getConversationMessages = (conversationId: string) => {
  return request.get(`/messages/${conversationId}`);
};

/**
 * 公会/俱乐部系统
 */
export const getClubs = () => {
  return request.get('/clubs');
};

export const createClub = (data: { name: string, creatorId: string }) => {
  return request.post('/clubs/create', data);
};

export const getClubDetail = (id: string) => {
  return request.get(`/clubs/${id}`);
};

export const joinClub = (clubId: string, userId: string) => {
  return request.post(`/clubs/${clubId}/join`, { userId });
};

export const getClubMembers = (clubId: string) => {
  return request.get(`/clubs/${clubId}/members`);
};

export const leaveClub = (clubId: string) => {
  return request.post(`/clubs/${clubId}/leave`);
};
