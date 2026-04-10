import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { AppError } from '../utils/AppError';

// 为 Express Request 追加 user 属性类型声明
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 核心的访问权限保护层，解析 JWT
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('你尚未登录，请提供访问令牌 (Token)', 401));
  }

  // 验证 Token 是否合法并解包出存储的 userId
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

  // 查询用户是否在发 Token 后又被数据库删除了，或是否已经被封禁
  const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!currentUser) {
    return next(new AppError('该凭证所属的用户已不存在', 401));
  }

  if (currentUser.status === 'BANNED') {
    return next(new AppError('该账号因违规已被封禁，无法执行操作', 403));
  }

  // 将经过 Prisma 查询鉴别后的安全 User 对象赋予给当前请求上下文，用于后续的控制器逻辑使用
  req.user = currentUser;
  next();
};

// 后台管理的 RBAC 权限边界保护层：仅允许设定的特定角色群体访问
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('您没有执行该操作所需的后台管理权限', 403));
    }
    next();
  };
};
