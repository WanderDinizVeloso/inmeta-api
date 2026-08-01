import { randomUUID } from 'node:crypto';

export interface SubmissionProps {
  id?: string;
  requirementId: string;
  logicalUrl: string;
  version?: number;
  isActive?: boolean;
  createdAt?: Date;
}

export class Submission {
  readonly id: string;
  readonly requirementId: string;
  readonly logicalUrl: string;
  readonly version: number;
  readonly isActive: boolean;
  readonly createdAt: Date;

  private constructor(props: SubmissionProps) {
    this.id = props.id || randomUUID();
    this.requirementId = props.requirementId;
    this.logicalUrl = props.logicalUrl;
    this.version = props.version ?? 1;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt || new Date();
  }

  static create(props: SubmissionProps): Submission {
    return new Submission(props);
  }
}
