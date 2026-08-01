import { SoftDeleteDocumentTypeUseCase } from './soft-delete-document-type.use-case';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';
import { DocumentType } from '../../domain/document-type.entity';
import { NotFoundException } from '@nestjs/common';

describe('SoftDeleteDocumentTypeUseCase', () => {
  let useCase: SoftDeleteDocumentTypeUseCase;
  let repository: jest.Mocked<DocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<DocumentTypeRepository>;

    useCase = new SoftDeleteDocumentTypeUseCase(repository);
  });

  it('deve realizar o soft delete com sucesso', async () => {
    const mockType = DocumentType.create({ name: 'ASO', description: 'Teste' });
    repository.findById.mockResolvedValue(mockType);

    await useCase.execute({ id: mockType.id });

    expect(repository.softDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockType.id, deletedAt: expect.any(Date) }),
    );
  });

  it('deve lançar NotFoundException se não existir', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'uuid-fake' })).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
