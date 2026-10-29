import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NestJS database...');
  await prisma.product.deleteMany();

  const products = [
    {
      name: 'Wireless Mechanical Keyboard',
      description: 'Hot-swappable tactile mechanical switch keyboard',
      price: 129.99,
      stock: 45,
    },
    {
      name: 'Ergonomic Vertical Mouse',
      description: 'Wireless Bluetooth rechargeable mouse with RGB',
      price: 59.99,
      stock: 80,
    },
    {
      name: '4K Ultra-Wide Monitor 34-inch',
      description: 'IPS HDR curved productivity display',
      price: 499.99,
      stock: 20,
    },
    {
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear studio monitor headphones with ANC',
      price: 199.99,
      stock: 35,
    },
    {
      name: 'Thunderbolt 4 Docking Station',
      description: '14-in-1 multi-display charging dock',
      price: 249.99,
      stock: 15,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log('NestJS database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

