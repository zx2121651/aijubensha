import 'package:flutter/material.dart';
import '../../room/screens/room_list_screen.dart';
import '../../discover/screens/discover_screen.dart';
import '../../community/screens/community_screen.dart';
// 个人中心暂用占位


/// 首页（带底部导航栏架构）
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const RoomListScreen(),
    const DiscoverScreen(),
    const CommunityScreen(),
    const Center(child: Text('我的 (Profile)')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF1E1E1E),
        selectedItemColor: const Color(0xFF6C63FF),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.meeting_room), label: '大厅'),
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: '探索'),
          BottomNavigationBarItem(icon: Icon(Icons.forum), label: '社区'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}
