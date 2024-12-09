export const mockPrismaService = {
  order: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  car: {
    findUnique: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
  },
};
