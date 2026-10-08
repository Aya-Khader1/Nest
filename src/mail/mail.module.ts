import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dirname, join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
          connectionTimeout: 10000, // 10 ثواني
          greetingTimeout: 10000,
          socketTimeout: 10000,
        },
        default: {
          from: `"No Reply" <${configService.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
