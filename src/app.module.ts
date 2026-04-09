import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Otp } from './entities/otp.entity';
import { MailerConfigModule } from './config/mailer.config';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('HOST'),
          port: config.get('DB_PORT'),
          // username: 'postgres',
          username: 'e_commerce_edme_user',
          password: config.get('PASSWORD'),
          database: config.get('DATABASE'),
          entities: [User, Cart, Product, Order, Otp],
          synchronize: true,
          ssl: { 
          rejectUnauthorized: false
          },
          extra: {
          max: 10, // max pool connections
          idleTimeoutMillis: 30000, // close idle connections after 30s
          },
        logging: ['error'],
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    CartModule,
    MailerConfigModule,
    MailModule,
  ],
})
export class AppModule {}

