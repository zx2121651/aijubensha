import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

/// 全局 HTTP 请求客户端封装 (基于 Dio)
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  late Dio dio;

  factory ApiClient() {
    return _instance;
  }

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        responseType: ResponseType.json,
      ),
    );

    // 添加请求/响应拦截器
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 在请求头中注入 Token
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString(AppConstants.tokenKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          // 可以在这里统一处理后端返回的格式，例如剥离 code/message 等
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          // 统一处理异常，如 401 提示重新登录、500 提示服务器错误等
          return handler.next(e);
        },
      ),
    );
  }

  // 封装常用请求方法
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return await dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) async {
    return await dio.post(path, data: data);
  }

  Future<Response> put(String path, {dynamic data}) async {
    return await dio.put(path, data: data);
  }

  Future<Response> delete(String path, {dynamic data}) async {
    return await dio.delete(path, data: data);
  }
}
