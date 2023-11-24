import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import BankPermissions from '../common/permissions/bank.permissions';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { UpdateBankDto } from './dto/update-bank.dto';
import { FindAllBankDto } from './dto/findAll-bank.dto';

@Resolver('/')
export class BankResolver {
  constructor(private readonly bankService: BankService) {}

  @Permissions(BankPermissions.ALL_PERMISSION.value, BankPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeCreateBank')
  create(@Args('createBankDto') createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  // @Permissions(BankPermissions.ALL_PERMISSION.value, BankPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findAllBanks')
  findAll(@Args('params') params: FindAllBankDto) {
    return this.bankService.getAll(params);
  }

  // @Permissions(BankPermissions.ALL_PERMISSION.value, BankPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findOneBank')
  getOne(@Args('bankId') bankId: string) {
    return this.bankService.getOne(bankId);
  }

  @Permissions(BankPermissions.ALL_PERMISSION.value, BankPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateBank')
  update(@Args('bankId') bankId: string, @Args('updateBankDto') updateBankDto: UpdateBankDto) {
    return this.bankService.updateOne(bankId, updateBankDto);
  }

  @Permissions(BankPermissions.ALL_PERMISSION.value, BankPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDeleteBank')
  deleteOne(@Args('bankId') bankId: string) {
    return this.bankService.deleteOne(bankId);
  }
}
