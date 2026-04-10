import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Prisma 数据库唯一约束报错拦截（如：手机号已存在）
  if (err.code === 'P2002') {
    const target = err.meta?.target?.join(', ');
    error = new AppError(`字段已被占用: ${target}`, 400);
  }

  // Zod 参数验证错误（如：密码少于 6 位）
  if (err && err.name === 'ZodError') {
    const messages = (err as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ');
    error = new AppError(`参数验证失败: ${messages}`, 400);
  }

  // JWT 鉴权解析错误
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('非法的凭证(Token)，请重新登录', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('您的登录状态已过期，请重新登录', 401);
  }

  // 区分开发环境与生产环境的详细报错
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.statusCode >= 400 && error.statusCode < 500 ? 'fail' : 'error',
      message: error.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // 生产环境隐藏堆栈与非业务抛出的服务器底层异常
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('💥 未捕获的内部错误:', err);
      res.status(500).json({
        status: 'error',
        message: '服务器开小差了，请稍后再试',
      });
    }
  }
};
