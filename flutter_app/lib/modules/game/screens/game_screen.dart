import 'package:flutter/material.dart';

/// 游戏主流程页面占位
class GameScreen extends StatelessWidget {
  const GameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('游戏中')),
      body: const Center(child: Text('这里是剧本杀主游戏界面 (线索、剧本、投票等)')),
    );
  }
}
