import { randomUUID } from 'node:crypto';

export interface DocumentTypeProps {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class DocumentType {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  private constructor(props: DocumentTypeProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  static create(props: DocumentTypeProps): DocumentType {
    return new DocumentType(props);
  }
}
