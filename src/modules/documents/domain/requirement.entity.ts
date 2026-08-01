import { randomUUID } from 'node:crypto';

export interface RequirementProps {
  id?: string;
  employeeId: string;
  documentTypeId: string;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Requirement {
  readonly id: string;
  readonly employeeId: string;
  readonly documentTypeId: string;
  readonly createdAt: Date;
  readonly deletedAt: Date | null;

  private constructor(props: RequirementProps) {
    this.id = props.id || randomUUID();
    this.employeeId = props.employeeId;
    this.documentTypeId = props.documentTypeId;
    this.createdAt = props.createdAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  static create(props: RequirementProps): Requirement {
    return new Requirement(props);
  }
}
