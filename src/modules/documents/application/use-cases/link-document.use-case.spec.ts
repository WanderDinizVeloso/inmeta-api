import { LinkDocumentUseCase } from './link-document.use-case';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';
import { ConflictException } from '@nestjs/common';
import { Requirement } from '../../domain/requirement.entity';

describe('LinkDocumentUseCase', () => {
  let useCase: LinkDocumentUseCase;
  let repository: jest.Mocked<RequirementRepository>;

  beforeEach(() => {
    repository = {
      findByEmployeeAndType: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<RequirementRepository>;

    useCase = new LinkDocumentUseCase(repository);
  });

  it('deve vincular um documento com sucesso', async () => {
    repository.findByEmployeeAndType.mockResolvedValue(null);

    const result = await useCase.execute({
      employeeId: 'emp-1',
      documentTypeId: 'doc-1',
    });

    expect(result).toBeInstanceOf(Requirement);
    expect(result.id).toBeDefined();
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('deve lançar ConflictException se já estiver vinculado', async () => {
    const mockReq = Requirement.create({
      employeeId: 'emp-1',
      documentTypeId: 'doc-1',
    });
    repository.findByEmployeeAndType.mockResolvedValue(mockReq);

    await expect(
      useCase.execute({ employeeId: 'emp-1', documentTypeId: 'doc-1' }),
    ).rejects.toThrow(ConflictException);
  });
});
