import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product]), AuthModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}