import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './help/database/database.module';
import { MailModule } from './help/mail/mail.module';
import { JwtAuthGuard } from './auth/guard';
import { APP_GUARD } from '@nestjs/core';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { ChatBotModule } from './modules/chatbot/chatbot.module';
import { VnpayModule } from './modules/vnpay/vnpay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 30,
    }]),
    DatabaseModule,
    AuthModule, 
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    MailModule,
    ChatBotModule,
    VnpayModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
