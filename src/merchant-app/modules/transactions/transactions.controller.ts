import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import transactionPermissions from '../common/permissions/transaction.permissions';
import { TransactionsService } from './transactions.service';
import { GetAllTransactionDto } from './dtos/get-all-transaction.dto';
import { TransactionQueryDto } from './dtos/transaction-query.dto';
@ApiBearerAuth()
@Controller('transactions')
@ApiTags(swaggerResources.Transactions)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiResponse({
    description: 'This API return all the transactions',
    status: 200,
  })
  @Get()
  findAll(@Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @ApiResponse({
    description: 'This API return all the transactions by merchant Id',
    status: 200,
  })
  @Permissions(transactionPermissions.ALL_PERMISSION.value, transactionPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get('merchant')
  findAllByMerchantId(@Query() getAllTransactionDto: GetAllTransactionDto, @CurrentUser() user: any) {
    return this.transactionsService.findAllByMerchantId(getAllTransactionDto, user);
  }

  @ApiResponse({
    description: 'This API return transaction by id',
    status: 200,
  })
  @Permissions(transactionPermissions.ALL_PERMISSION.value, transactionPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get(':transactionId')
  findOne(@Param('transactionId') transactionId: string) {
    return this.transactionsService.findOne(transactionId);
  }

  @ApiResponse({
    description: 'This API update transaction by transactionId and return the new transaction data',
    status: 200,
  })
  @Permissions(transactionPermissions.ALL_PERMISSION.value, transactionPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch(':transactionId')
  update(@Param('transactionId') transactionId: string, updateTransactionDto: any) {
    return this.transactionsService.update(transactionId, updateTransactionDto);
  }
}
