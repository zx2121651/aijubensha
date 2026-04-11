
import 'package:go_router/go_router.dart';
import '../../modules/auth/screens/auth_screen.dart';
import '../../modules/home/screens/home_screen.dart';
import '../../modules/room/screens/room_detail_screen.dart';

/// 应用程序全局路由配置
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/auth',
    routes: [
      GoRoute(path: '/auth', builder: (context, state) => const AuthScreen()),
      GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
      GoRoute(
        path: '/room/detail/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return RoomDetailScreen(roomId: id);
        },
      ),
      // 可以继续添加游戏内路由
    ],
  );
}
