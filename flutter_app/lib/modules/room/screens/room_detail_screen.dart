import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../providers/room_provider.dart';
import '../../../widgets/custom_button.dart';

/// 房间内部详情页面
class RoomDetailScreen extends StatefulWidget {
  final String roomId;

  const RoomDetailScreen({super.key, required this.roomId});

  @override
  State<RoomDetailScreen> createState() => _RoomDetailScreenState();
}

class _RoomDetailScreenState extends State<RoomDetailScreen> {
  @override
  void initState() {
    super.initState();
    // 延迟一帧后加入房间，避免构建时修改状态
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<RoomProvider>(context, listen: false).joinRoom(widget.roomId);
    });
  }

  @override
  void dispose() {
    // 退出时离开房间（注意：这里可能需要判断是否因为退回而离开，实际应用中可以放到退出按钮中处理）
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('房间 ${widget.roomId}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Provider.of<RoomProvider>(context, listen: false).leaveRoom();
            context.pop();
          },
        ),
      ),
      body: Consumer<RoomProvider>(
        builder: (context, roomProvider, child) {
          final participants = roomProvider.participants;

          return Column(
            children: [
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.8,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  itemCount: participants.isEmpty ? 6 : participants.length,
                  itemBuilder: (context, index) {
                    final hasUser = index < participants.length;
                    return Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1E1E),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.withOpacity(0.3)),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: hasUser
                                ? const Color(0xFF6C63FF)
                                : Colors.grey.withOpacity(0.2),
                            child: Icon(
                              hasUser ? Icons.person : Icons.person_outline,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(hasUser ? '玩家 ${index + 1}' : '空位'),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(32.0),
                child: CustomButton(
                  text: '准备开始',
                  onPressed: () {
                    // TODO: 触发游戏开始逻辑
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
