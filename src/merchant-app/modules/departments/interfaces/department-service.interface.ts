import { User } from '../../models';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

export interface CreateDepartmentArgs {
  body: CreateDepartmentDto;
  account: User;
}

export interface FindDepartmentsArgs {
  account: User;
}

export interface FindDepartmentByIdArgs {
  id: string;
  account: User;
}

export interface UpdateDepartmentArgs {
  id: string;
  body: UpdateDepartmentDto;
  account: User;
}

export interface DeleteDepartmentByIdArgs {
  id: string;
  account: User;
}
