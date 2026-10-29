import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Liveness check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'nest-app',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check verifying database connectivity' })
  @ApiResponse({ status: 200, description: 'Service and database are ready' })
  @ApiResponse({ status: 503, description: 'Database unreachable' })
  async getReadiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        service: 'nest-app',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new HttpException(
        {
          status: 'not_ready',
          service: 'nest-app',
          database: 'disconnected',
          error: err.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

