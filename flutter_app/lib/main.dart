import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'providers/auth_provider.dart';
import 'providers/app_provider.dart';
import 'providers/room_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 初始化全局服务如 SharedPreferences...

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => AppProvider()),
        ChangeNotifierProvider(create: (_) => RoomProvider()),
      ],
      child: const JubenshaApp(),
    ),
  );
}

class JubenshaApp extends StatelessWidget {
  const JubenshaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '剧本杀 (Jubensha)',
      theme: AppTheme.darkTheme,
      routerConfig: AppRouter.router,
      debugShowCheckedModeBanner: false,
    );
  }
}
