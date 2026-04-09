import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 配置全局基础 URL 和超时时间
const baseURL = false
  ? 'https://api.jubensha.com/api/app' // 替换为真实的线上地址
  : 'http://localhost:4000/api/app';

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动携带 Token
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('app_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误提示
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回数据部分，简化组件调用
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data.message || '请求失败';

      switch (status) {
        case 401:
          errorMessage = '登录已过期，请重新登录';
          // 这里可以触发事件或跳转到登录页
          localStorage.removeItem('app_token');
          window.location.href = '/auth';
          break;
        case 403:
          errorMessage = '权限不足';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          break;
      }

      // 可以在这里引入 UI 库的 Toast/Message 提示，例如：
      // Toast.show(errorMessage)
      console.error('[API Error]:', errorMessage);
    } else {
      console.error('[Network Error]:', error.message);
    }

    return Promise.reject(error);
  }
);

export default request;
