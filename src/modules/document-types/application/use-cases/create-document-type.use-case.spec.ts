import { CreateDocumentTypeUseCase } from './create-document-type.use-case';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';
import { ConflictException } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';

describe('CreateDocumentTypeUseCase', () => {
  let useCase: CreateDocumentTypeUseCase;
  let repository: jest.Mocked<DocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      findByName: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<DocumentTypeRepository>;

    useCase = new CreateDocumentTypeUseCase(repository);
  });

  it('deve criar um tipo de documento com sucesso', async () => {
    repository.findByName.mockResolvedValue(null);

    const result = await useCase.execute({
      name: 'ASO',
      description: 'Atestado de Saúde',
    });

    expect(result).toBeInstanceOf(DocumentType);
    expect(result.id).toBeDefined();
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('deve lançar ConflictException se o nome já existir', async () => {
    const mockType = DocumentType.create({
      name: 'ASO',
      description: 'Existente',
    });
    repository.findByName.mockResolvedValue(mockType);

    await expect(
      useCase.execute({ name: 'ASO', description: 'Novo ASO' }),
    ).rejects.toThrow(ConflictException);

    expect(repository.save).not.toHaveBeenCalled();
  });
});
