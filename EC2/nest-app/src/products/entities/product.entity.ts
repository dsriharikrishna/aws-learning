import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty({ example: 'clx123abc456' })
  id: string;

  @ApiProperty({ example: 'Ergonomic Desk Chair' })
  name: string;

  @ApiPropertyOptional({ example: 'Adjustable mesh office chair with lumbar support' })
  description: string | null;

  @ApiProperty({ example: 199.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

