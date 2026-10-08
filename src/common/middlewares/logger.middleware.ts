import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      this.logger.log(
        `[${method}] ${originalUrl} ${statusCode} ${duration}ms - IP :${ip} (${userAgent})`,
      );
    });

    next();
  }
}
