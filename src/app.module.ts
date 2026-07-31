import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';

@Module({
  imports: [PrismaModule, EmployeesModule, DocumentTypesModule],
})
export class AppModule {}
