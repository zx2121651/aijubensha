export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 表示这是预期的业务报错，非代码 BUG
    Error.captureStackTrace(this, this.constructor);
  }
}
