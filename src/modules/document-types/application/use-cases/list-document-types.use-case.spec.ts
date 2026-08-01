import { ListDocumentTypesUseCase } from './list-document-types.use-case';
import { DocumentTypeRepository } from '../../infra/repositories/document-type.repository';
import { DocumentType } from '../../domain/document-type.entity';

describe('ListDocumentTypesUseCase', () => {
  let useCase: ListDocumentTypesUseCase;
  let repository: jest.Mocked<DocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<DocumentTypeRepository>;

    useCase = new ListDocumentTypesUseCase(repository);
  });

  it('deve retornar tipos de documentos paginados', async () => {
    const mockType = DocumentType.create({ name: 'ASO', description: 'Teste' });
    repository.findAll.mockResolvedValue({ items: [mockType], total: 1 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });
});
