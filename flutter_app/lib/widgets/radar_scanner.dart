import 'package:flutter/material.dart';
import 'dart:math' as math;

/// 沉浸式雷达扫描动画组件（类似于 Soul App 的匹配动画）
class RadarScanner extends StatefulWidget {
  final double size;
  final Color color;

  const RadarScanner({
    super.key,
    this.size = 300.0,
    this.color = const Color(0xFF6C63FF),
  });

  @override
  State<RadarScanner> createState() => _RadarScannerState();
}

class _RadarScannerState extends State<RadarScanner>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            painter: RadarPainter(
              animationValue: _controller.value,
              color: widget.color,
            ),
          );
        },
      ),
    );
  }
}

class RadarPainter extends CustomPainter {
  final double animationValue;
  final Color color;

  RadarPainter({required this.animationValue, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2;

    // 绘制雷达背景圈
    final circlePaint = Paint()
      ..color = color.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    for (int i = 1; i <= 4; i++) {
      canvas.drawCircle(center, radius * (i / 4), circlePaint);
    }

    // 绘制扫描扇形
    final sweepPaint = Paint()
      ..shader = SweepGradient(
        colors: [
          color.withOpacity(0.0),
          color.withOpacity(0.5),
          color.withOpacity(0.8),
        ],
        stops: const [0.0, 0.9, 1.0],
        transform: GradientRotation(animationValue * 2 * math.pi),
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.fill;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      animationValue * 2 * math.pi - math.pi / 2,
      math.pi / 2,
      true,
      sweepPaint,
    );

    // 绘制扫描线
    final linePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    final double lineAngle = animationValue * 2 * math.pi - math.pi / 2;
    final double endX = center.dx + radius * math.cos(lineAngle);
    final double endY = center.dy + radius * math.sin(lineAngle);

    canvas.drawLine(center, Offset(endX, endY), linePaint);
  }

  @override
  bool shouldRepaint(covariant RadarPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
