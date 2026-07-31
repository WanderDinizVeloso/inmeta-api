import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';

@Module({
  imports: [PrismaModule, EmployeesModule],
})
export class AppModule {}
