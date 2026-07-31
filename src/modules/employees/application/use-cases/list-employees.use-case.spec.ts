import { ListEmployeesUseCase } from './list-employees.use-case';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { Employee } from '../../domain/employee.entity';

describe('ListEmployeesUseCase', () => {
  let useCase: ListEmployeesUseCase;
  let repository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<EmployeeRepository>;

    useCase = new ListEmployeesUseCase(repository);
  });

  it('deve retornar colaboradores paginados', async () => {
    const mockEmployee = Employee.create({
      name: 'Wander',
      email: 'wander@inmeta.com',
    });

    repository.findAll.mockResolvedValue({ items: [mockEmployee], total: 1 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].email).toBe('wander@inmeta.com');
    expect(result.meta).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      lastPage: 1,
    });
  });
});
