import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../modules/home/screens/home_screen.dart';
import '../../modules/auth/screens/auth_screen.dart';
import '../../modules/community/screens/community_screen.dart';

class AppRouter {
  static final GlobalKey<NavigatorState> rootNavigatorKey =
      GlobalKey<NavigatorState>();

  static CustomTransitionPage buildPageWithDefaultTransition<T>({
    required BuildContext context,
    required GoRouterState state,
    required Widget child,
  }) {
    return CustomTransitionPage<T>(
      key: state.pageKey,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.easeInOutCubic;
          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
      },
    );
  }

  static final GoRouter router = GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'home',
        pageBuilder: (context, state) => buildPageWithDefaultTransition(context: context, state: state, child: const HomeScreen()),
      ),
      GoRoute(
        path: '/auth',
        name: 'auth',
        pageBuilder: (context, state) => buildPageWithDefaultTransition(context: context, state: state, child: const AuthScreen()),
      ),
      GoRoute(
        path: '/community',
        name: 'community',
        pageBuilder: (context, state) => buildPageWithDefaultTransition(context: context, state: state, child: const CommunityScreen()),
        routes: [
          GoRoute(
            path: 'post/:id',
            name: 'post_detail',
            pageBuilder: (context, state) {
              final id = state.pathParameters['id']!;
              return buildPageWithDefaultTransition(context: context, state: state, child: Scaffold(body: Center(child: Text('Post $id'))));
            },
          ),
        ]
      ),
      GoRoute(
        path: '/user/:id',
        name: 'user_profile',
        pageBuilder: (context, state) {
          final id = state.pathParameters['id']!;
          return buildPageWithDefaultTransition(context: context, state: state, child: Scaffold(body: Center(child: Text('User $id'))));
        },
      ),
      GoRoute(
        path: '/script/:id',
        name: 'script_detail',
        pageBuilder: (context, state) {
          final id = state.pathParameters['id']!;
          return buildPageWithDefaultTransition(context: context, state: state, child: Scaffold(body: Center(child: Text('Script $id'))));
        },
      ),
    ],
  );
}
