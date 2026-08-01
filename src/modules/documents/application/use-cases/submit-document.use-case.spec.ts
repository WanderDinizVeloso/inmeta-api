import { SubmitDocumentUseCase } from './submit-document.use-case';
import { RequirementRepository } from '../../infra/repositories/requirement.repository';
import { SubmissionRepository } from '../../infra/repositories/submission.repository';
import { Requirement } from '../../domain/requirement.entity';
import { Submission } from '../../domain/submission.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SubmitDocumentUseCase', () => {
  let useCase: SubmitDocumentUseCase;
  let requirementRepo: jest.Mocked<RequirementRepository>;
  let submissionRepo: jest.Mocked<SubmissionRepository>;

  beforeEach(() => {
    requirementRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<RequirementRepository>;
    submissionRepo = {
      findActiveByRequirementId: jest.fn(),
      saveNewVersion: jest.fn(),
    } as unknown as jest.Mocked<SubmissionRepository>;

    useCase = new SubmitDocumentUseCase(requirementRepo, submissionRepo);
  });

  it('deve realizar o primeiro envio (versão 1) com sucesso', async () => {
    const mockReq = Requirement.create({
      employeeId: 'emp1',
      documentTypeId: 'doc1',
    });
    requirementRepo.findById.mockResolvedValue(mockReq);
    submissionRepo.findActiveByRequirementId.mockResolvedValue(null);

    const result = await useCase.execute({
      requirementId: mockReq.id,
      logicalUrl: 'url-1',
    });

    expect(result.version).toBe(1);
    expect(result.isActive).toBe(true);
    expect(submissionRepo.saveNewVersion).toHaveBeenCalledWith(
      expect.objectContaining({
        oldSubmissionId: undefined,
        newSubmission: result,
      }),
    );
  });

  it('deve incrementar para versão 2 se já existir um envio ativo', async () => {
    const mockReq = Requirement.create({
      employeeId: 'emp1',
      documentTypeId: 'doc1',
    });
    const mockSub = Submission.create({
      requirementId: mockReq.id,
      logicalUrl: 'url-1',
      version: 1,
      isActive: true,
    });

    requirementRepo.findById.mockResolvedValue(mockReq);
    submissionRepo.findActiveByRequirementId.mockResolvedValue(mockSub);

    const result = await useCase.execute({
      requirementId: mockReq.id,
      logicalUrl: 'url-2',
    });

    expect(result.version).toBe(2);
    expect(submissionRepo.saveNewVersion).toHaveBeenCalledWith(
      expect.objectContaining({
        oldSubmissionId: mockSub.id,
        newSubmission: result,
      }),
    );
  });

  it('deve lançar NotFoundException se o requirementId não existir', async () => {
    requirementRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ requirementId: 'invalido', logicalUrl: 'url' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve repassar ConflictException se o repositório identificar concorrência', async () => {
    const mockReq = Requirement.create({
      employeeId: 'emp1',
      documentTypeId: 'doc1',
    });
    requirementRepo.findById.mockResolvedValue(mockReq);
    submissionRepo.findActiveByRequirementId.mockResolvedValue(null);

    const errorMsg =
      'Conflito de concorrência: Um reenvio para este documento já está sendo processado simultaneamente.';
    submissionRepo.saveNewVersion.mockRejectedValue(
      new ConflictException(errorMsg),
    );

    await expect(
      useCase.execute({ requirementId: mockReq.id, logicalUrl: 'url-1' }),
    ).rejects.toThrow(ConflictException);
  });
});
