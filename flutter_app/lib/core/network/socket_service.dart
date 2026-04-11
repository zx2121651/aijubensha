import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

/// 全局 Socket.io 实时通讯服务封装
class SocketService {
  static final SocketService _instance = SocketService._internal();
  IO.Socket? _socket;

  factory SocketService() {
    return _instance;
  }

  SocketService._internal();

  /// 初始化并连接 Socket
  Future<void> connect() async {
    if (_socket != null && _socket!.connected) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConstants.tokenKey);

    _socket = IO.io(AppConstants.socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
      'auth': {'token': token}, // 通过 auth 传递 token 进行鉴权
    });

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Socket connected: ${_socket!.id}');
    });

    _socket!.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket!.onError((error) {
      print('Socket error: $error');
    });
  }

  /// 断开连接
  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  /// 监听事件
  void on(String event, dynamic Function(dynamic) callback) {
    _socket?.on(event, callback);
  }

  /// 移除事件监听
  void off(String event) {
    _socket?.off(event);
  }

  /// 触发事件
  void emit(String event, [dynamic data]) {
    _socket?.emit(event, data);
  }
}
