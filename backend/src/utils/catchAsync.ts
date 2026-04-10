import { Request, Response, NextFunction } from 'express';

// 捕获异步函数中抛出的错误（或未捕获的 reject），转交给全局 Error Handling Middleware
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
