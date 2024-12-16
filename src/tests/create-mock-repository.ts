import { SelectQueryBuilder } from 'typeorm';
import { createMock } from './create-mock';

type MockRepository<T> = jest.Mocked<T> & {
  createQueryBuilder: jest.Mocked<SelectQueryBuilder<T>>;
};

function createMockSelectQueryBuilder<T>(): jest.Mocked<SelectQueryBuilder<T>> {
  return {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]), // Example of mocked result
    getOne: jest.fn().mockResolvedValue(null),
    execute: jest.fn().mockResolvedValue({}),
    // Include other methods as needed
  } as unknown as jest.Mocked<SelectQueryBuilder<T>>;
}

export function createMockRepository<T>(
  cls: new (...args: any[]) => T,
): MockRepository<T> {
  const mock = createMock(cls) as MockRepository<T>;
  mock.createQueryBuilder = jest.fn(createMockSelectQueryBuilder) as any;

  return mock;
}
