import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { message as antdMessage } from 'antd'; // 后台专用的全局提示组件

const baseURL = false
  ? 'https://api.jubensha.com/api/admin' // 后台独立的线上地址前缀
  : 'http://localhost:4000/api/admin';

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000, // 后台通常涉及大数据量或报表，超时时间设置得长一些
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 自动解包后端返回的数据包裹层
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data.message || '管理系统请求失败';

      switch (status) {
        case 401:
          errorMessage = '管理员登录状态已失效，请重新登录';
          localStorage.removeItem('admin_token');
          // 强制登出跳转，通常配合 window.location 或专门的路由管理
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          errorMessage = '您没有执行该操作的权限 (RBAC 拦截)';
          break;
        case 500:
          errorMessage = '后台服务器内部错误，请联系技术人员';
          break;
        default:
          break;
      }

      // 使用 Ant Design 全局消息弹窗提示错误
      antdMessage.error(errorMessage);
    } else {
      antdMessage.error('网络连接失败或服务器无响应，请检查网络');
    }

    return Promise.reject(error);
  }
);

export default request;
