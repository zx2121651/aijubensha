/// 应用程序全局常量配置
class AppConstants {
  // 后端 API 基础地址 (可根据实际环境配置)
  // 开发环境通常为本地 IP 或 localhost
  static const String apiBaseUrl = 'http://10.0.2.2:3000/api';

  // Socket.io 连接地址
  static const String socketUrl = 'http://10.0.2.2:3000';

  // SharedPreferences keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'auth_user';
}
