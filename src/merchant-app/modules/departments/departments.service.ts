import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { DepartmentRepository } from '../models';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetAllDepartmentsDto } from './dto/get-all-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

interface IMappedBody extends Partial<CreateDepartmentDto> {
  name?: string;
  translation?: { name: string }[];
}
@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = {
      ...createDepartmentDto,
      name: createDepartmentDto.nameArabic,
      translation: {
        name: createDepartmentDto.nameEnglish,
        _lang: 'en',
      },
    };
    return this.departmentRepository.create(department);
  }

  public find(query: GetAllDepartmentsDto) {
    return this.departmentRepository.findAll(query);
  }

  async findById(id: string) {
    const department = await this.departmentRepository.getOne({
      _id: id,
      isDeleted: false,
    });

    if (!department) {
      throw new NotFoundException(ERROR_CODES.err_department_not_found);
    }

    return department;
  }
  async update(id: string, body: UpdateDepartmentDto) {
    const foundDep = await this.departmentRepository.getById(id, {});
    if (!foundDep) {
      throw new NotFoundException(ERROR_CODES.err_department_not_found);
    }

    const mappedBody: IMappedBody = {
      ...body,
      translation: foundDep.translation,
    };
    Object.keys(body)?.map((key) => {
      if (key === 'nameArabic') mappedBody.name = body[key];
      if (key === 'nameEnglish') mappedBody.translation[0].name = body[key];
    });
    const res = await this.departmentRepository.updateById(id, mappedBody, { new: true }, {});
    return res;
  }

  async removeDepartment(id: string) {
    await this.findById(id);
    const res = await this.departmentRepository.deleteById(id);
    if (res) {
      return { success: true };
    }
    return { success: false };
  }
}
