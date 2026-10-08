import { Module } from '@nestjs/common';
import { CachingService } from './caching.service.js';
import { CachingInterceptor } from './interceptors/http-cache.interceptor.js';
@Module({
  providers: [CachingService, CachingInterceptor],
  exports: [CachingService, CachingInterceptor],
})
export class CachingModule {}
