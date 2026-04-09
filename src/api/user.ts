import request from './request';

/**
 * 个人资料接口
 */
export const getUserProfile = (userId: string) => {
  return request.get(`/user/profile`, { params: { userId } });
};

export const updateUserProfile = (data: { userId: string, nickname?: string, avatar?: string }) => {
  return request.put(`/user/profile`, data);
};

export const getUserInventory = () => {
  return request.get(`/user/inventory`);
};

export const getWalletBalance = (userId: string) => {
  return request.get(`/wallet/balance`, { params: { userId } });
};

export const getWalletHistory = () => {
  return request.get(`/wallet/history`);
};

/**
 * 商城道具与充值系统接口
 */
export const rechargeWallet = (data: { userId: string, amount: number }) => {
  return request.post(`/wallet/recharge`, data);
};

export const withdrawWallet = () => {
  return request.post(`/wallet/withdraw`);
};

export const getOrderStatus = (id: string) => {
  return request.get(`/wallet/order/${id}`);
};
