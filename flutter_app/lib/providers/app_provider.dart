import 'package:flutter/material.dart';

/// 全局应用状态管理 (主题、本地化、基础 UI 状态)
class AppProvider with ChangeNotifier {
  // 当前是否是暗黑模式 (此应用默认沉浸式暗黑风格，可扩展为动态切换)
  bool _isDarkMode = true;

  bool get isDarkMode => _isDarkMode;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }
}
