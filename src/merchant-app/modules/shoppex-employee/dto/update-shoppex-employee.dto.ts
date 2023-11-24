import { PartialType } from '@nestjs/swagger';

import { CreateShoppexEmployeeDto } from './create-shoppex-employee.dto';

export class UpdateShoppexEmployeeDto extends PartialType(CreateShoppexEmployeeDto) {}
