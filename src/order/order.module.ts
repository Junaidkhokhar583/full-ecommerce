import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderController } from './order.controller';
import { Product } from 'src/entities/product.entity';
import { Cart } from 'src/entities/cart.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Product,Cart]),AuthModule],
  controllers:[OrderController],
  providers: [OrderService,MailService]

})
export class OrderModule {}
