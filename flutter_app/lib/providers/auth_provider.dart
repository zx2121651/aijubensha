import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import '../core/network/api_client.dart';

/// 全局认证状态管理
class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  Map<String, dynamic>? _user;

  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;

  AuthProvider() {
    _loadAuthData();
  }

  /// 启动时从本地存储加载用户和 token 数据
  Future<void> _loadAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(AppConstants.tokenKey);
    // 此处可解析 userKey 获取用户信息
    if (_token != null && _token!.isNotEmpty) {
      _isAuthenticated = true;
    }
    notifyListeners();
  }

  /// 登录逻辑
  Future<bool> login(String email, String password) async {
    try {
      final response = await ApiClient().post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      if (response.statusCode == 200 && response.data['token'] != null) {
        _token = response.data['token'];
        _user = response.data['user'];
        _isAuthenticated = true;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.tokenKey, _token!);
        // 可以将 user 转为 JSON 字符串存入 prefs

        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('登录失败: $e');
      return false;
    }
  }

  /// 登出逻辑
  Future<void> logout() async {
    _isAuthenticated = false;
    _token = null;
    _user = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.tokenKey);
    await prefs.remove(AppConstants.userKey);

    notifyListeners();
  }
}
