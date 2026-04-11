import 'package:flutter/material.dart';
import '../core/network/socket_service.dart';

/// 剧本杀房间状态管理
class RoomProvider with ChangeNotifier {
  String? _currentRoomId;
  List<dynamic> _participants = [];
  Map<String, dynamic>? _roomInfo;

  String? get currentRoomId => _currentRoomId;
  List<dynamic> get participants => _participants;
  Map<String, dynamic>? get roomInfo => _roomInfo;

  /// 加入房间
  void joinRoom(String roomId) {
    _currentRoomId = roomId;
    // 通过 socket 发送加入房间事件
    SocketService().emit('join_room', {'roomId': roomId});

    // 监听房间状态更新
    SocketService().on('room_update', (data) {
      if (data['participants'] != null) {
        _participants = data['participants'];
      }
      if (data['roomInfo'] != null) {
        _roomInfo = data['roomInfo'];
      }
      notifyListeners();
    });

    notifyListeners();
  }

  /// 离开房间
  void leaveRoom() {
    if (_currentRoomId != null) {
      SocketService().emit('leave_room', {'roomId': _currentRoomId});
      SocketService().off('room_update');
    }
    _currentRoomId = null;
    _participants = [];
    _roomInfo = null;
    notifyListeners();
  }
}
