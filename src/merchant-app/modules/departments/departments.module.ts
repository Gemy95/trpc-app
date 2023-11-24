import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { ConfigurationService } from '../config/configuration.service';
import { Department, DepartmentRepository, DepartmentSchema } from '../models';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { DepartmentsResolver } from './departments.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]), OneSignalModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, ConfigurationService, DepartmentRepository, DepartmentsResolver],
  exports: [DepartmentRepository, DepartmentsService],
})
export class DepartmentsModule {}
