import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),AuthModule,ConfigModule],
  controllers: [ProductController],
  providers:[ProductService,CloudinaryProvider],
  exports:[CloudinaryProvider]
})
export class ProductModule {}
