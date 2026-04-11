import 'package:flutter_webrtc/flutter_webrtc.dart' as webrtc;
import 'socket_service.dart';

/// 全局 WebRTC 音视频通讯服务封装
class WebRTCService {
  static final WebRTCService _instance = WebRTCService._internal();

  webrtc.RTCPeerConnection? _peerConnection;
  webrtc.MediaStream? _localStream;

  // 供外部绑定的本地/远端渲染器
  webrtc.RTCVideoRenderer localRenderer = webrtc.RTCVideoRenderer();
  webrtc.RTCVideoRenderer remoteRenderer = webrtc.RTCVideoRenderer();

  factory WebRTCService() {
    return _instance;
  }

  WebRTCService._internal();

  /// 初始化渲染器并获取本地媒体流
  Future<void> initialize() async {
    await localRenderer.initialize();
    await remoteRenderer.initialize();

    // 打开音视频
    final Map<String, dynamic> mediaConstraints = {
      'audio': true,
      'video': {'facingMode': 'user'},
    };

    _localStream = await webrtc.navigator.mediaDevices.getUserMedia(
      mediaConstraints,
    );
    localRenderer.srcObject = _localStream;
  }

  /// 创建对等连接并设置回调
  Future<void> createConnection(String roomId) async {
    final Map<String, dynamic> configuration = {
      "iceServers": [
        {"url": "stun:stun.l.google.com:19302"},
      ],
    };

    _peerConnection = await webrtc.createPeerConnection(configuration, {});

    // 将本地流添加到连接中
    _localStream?.getTracks().forEach((track) {
      _peerConnection?.addTrack(track, _localStream!);
    });

    // 监听 ICE 候选者，发送给信令服务器 (Socket)
    _peerConnection?.onIceCandidate = (webrtc.RTCIceCandidate candidate) {
      SocketService().emit('webrtc_ice_candidate', {
        'roomId': roomId,
        'candidate': candidate.toMap(),
      });
    };

    // 监听远端流
    _peerConnection?.onAddStream = (webrtc.MediaStream stream) {
      remoteRenderer.srcObject = stream;
    };
  }

  /// 释放资源
  Future<void> dispose() async {
    _localStream?.getTracks().forEach((track) => track.stop());
    _localStream?.dispose();
    _peerConnection?.dispose();
    await localRenderer.dispose();
    await remoteRenderer.dispose();
  }
}
