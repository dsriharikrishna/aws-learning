import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Ergonomic Desk Chair' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Detailed product description', example: 'Adjustable mesh office chair with lumbar support' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Price in USD', example: 199.99 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ description: 'Stock quantity available', example: 50, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;
}

