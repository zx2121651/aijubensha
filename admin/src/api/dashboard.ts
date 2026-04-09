import request from './request';

/**
 * 获取控制台首屏数据大盘汇总
 */
export const getDashboardStats = () => {
  return request.get('/dashboard/stats');
};

/**
 * 获取图表展示所需的数据（营收、留存趋势等）
 */
export const getDashboardCharts = () => {
  return request.get('/dashboard/charts');
};
