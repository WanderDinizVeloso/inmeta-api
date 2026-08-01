import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    PrismaModule,
    EmployeesModule,
    DocumentTypesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
