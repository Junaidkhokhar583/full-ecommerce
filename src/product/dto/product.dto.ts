import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class AddProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Latest Apple flagship phone' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 12})
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class EditProductDto {

  @ApiPropertyOptional({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Latest Apple mobile phone' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 999.99 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

