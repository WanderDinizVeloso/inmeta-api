import { UnlinkDocumentUseCase } from './unlink-document.use-case';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';
import { Requirement } from '../../domain/requirement.entity';
import { NotFoundException } from '@nestjs/common';

describe('UnlinkDocumentUseCase', () => {
  let useCase: UnlinkDocumentUseCase;
  let repository: jest.Mocked<RequirementRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<RequirementRepository>;

    useCase = new UnlinkDocumentUseCase(repository);
  });

  it('deve desvincular (soft delete) com sucesso', async () => {
    const mockReq = Requirement.create({
      employeeId: 'emp-1',
      documentTypeId: 'doc-1',
    });
    repository.findById.mockResolvedValue(mockReq);

    await useCase.execute({ id: mockReq.id });

    expect(repository.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockReq.id, deletedAt: expect.any(Date) }),
    );
  });

  it('deve lançar NotFoundException se a vinculação não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'uuid-invalido' })).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
