import { randomUUID } from 'node:crypto';

export interface EmployeeProps {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Employee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  private constructor(props: EmployeeProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.deletedAt = props.deletedAt || null;
  }

  static create(props: EmployeeProps): Employee {
    return new Employee(props);
  }
}
