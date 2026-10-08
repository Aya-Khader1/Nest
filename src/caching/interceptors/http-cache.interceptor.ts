import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CachingService } from '../caching.service.js';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  constructor(private readonly redisService: CachingService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') return next.handle();

    const cacheKey = `cache:${request.originalUrl || request.url}`;
    try {
      const cacheData = await this.redisService.get(cacheKey);
      if (cacheData) return of(JSON.parse(cacheData));
    } catch (error) {
      console.log('Redis read failure', error);
    }

    const now = Date.now();
    return next.handle().pipe(
      map(async (data) => {
        try {
          if (data) await this.redisService.set(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.log(`Redis write failure`, error);
        }
        return data;
      }),
    );
  }
}
