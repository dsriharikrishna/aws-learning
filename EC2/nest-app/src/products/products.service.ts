import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock ?? 0,
      },
    });
    return { ...product, price: Number(product.price) };
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items.map((p) => ({ ...p, price: Number(p.price) })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { ...product, price: Number(product.price) };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(updateProductDto.name && { name: updateProductDto.name }),
        ...(updateProductDto.description !== undefined && { description: updateProductDto.description }),
        ...(updateProductDto.price !== undefined && { price: updateProductDto.price }),
        ...(updateProductDto.stock !== undefined && { stock: updateProductDto.stock }),
      },
    });
    return { ...product, price: Number(product.price) };
  }

  async remove(id: string) {
    await this.findOne(id);
    const product = await this.prisma.product.delete({
      where: { id },
    });
    return { ...product, price: Number(product.price) };
  }
}

