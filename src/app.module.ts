import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';
import { AuthController } from './auth/auth.controller.js';
import { CategoryModule } from './category/category.module.js';
import { BrandModule } from './brand/brand.module.js';
import { ProductModule } from './product/product.module.js';
import { CartModule } from './cart/cart.module.js';
import { ReviewModule } from './review/review.module.js';
import { CouponModule } from './coupon/coupon.module.js';
import { CachingModule } from './caching/caching.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env'),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('connected');
          });
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    ReviewModule,
    CouponModule,
    CachingModule,
    OrdersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
