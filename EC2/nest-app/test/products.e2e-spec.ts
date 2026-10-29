import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('NestJS Products API (e2e)', () => {
  let app: INestApplication;

  const mockProduct = {
    id: 'prod-test-123',
    name: 'Test Gaming Mouse',
    description: 'High precision optical sensor',
    price: 49.99,
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPrisma = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    product: {
      create: jest.fn().mockResolvedValue(mockProduct),
      findMany: jest.fn().mockResolvedValue([mockProduct]),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'prod-test-123') return Promise.resolve(mockProduct);
        return Promise.resolve(null);
      }),
      update: jest.fn().mockResolvedValue({ ...mockProduct, name: 'Updated Gaming Mouse' }),
      delete: jest.fn().mockResolvedValue(mockProduct),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/nest');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/nest/health should return 200 ok', () => {
    return request(app.getHttpServer())
      .get('/api/nest/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('nest-app');
      });
  });

  it('GET /api/nest/ready should return 200 ready when DB pings', () => {
    return request(app.getHttpServer())
      .get('/api/nest/ready')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ready');
        expect(res.body.database).toBe('connected');
      });
  });

  it('POST /api/nest/products should create product', () => {
    return request(app.getHttpServer())
      .post('/api/nest/products')
      .send({
        name: 'Test Gaming Mouse',
        description: 'High precision optical sensor',
        price: 49.99,
        stock: 100,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Test Gaming Mouse');
        expect(res.body.price).toBe(49.99);
      });
  });

  it('POST /api/nest/products should fail 400 on invalid payload', () => {
    return request(app.getHttpServer())
      .post('/api/nest/products')
      .send({
        name: '',
        price: -10,
      })
      .expect(400);
  });

  it('GET /api/nest/products should return list with pagination meta', () => {
    return request(app.getHttpServer())
      .get('/api/nest/products?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.meta.total).toBe(1);
      });
  });

  it('GET /api/nest/products/:id should return 404 for nonexistent product', () => {
    return request(app.getHttpServer())
      .get('/api/nest/products/non-existent-id')
      .expect(404);
  });
});
