import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import transactionPermissions from '../common/permissions/transaction.permissions';
import { TransactionsService } from './transactions.service';
import { GetAllTransactionDto } from './dtos/get-all-transaction.dto';
import { TransactionQueryDto } from './dtos/transaction-query.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';

@Resolver('')
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query('findAllTransactions')
  findAll(@Args('query') query: TransactionQueryDto) {
    return this.transactionsService.findAll(query);
  }

  // @Permissions(
  //     transactionPermissions.ALL_PERMISSION.value,
  //     transactionPermissions.READ_PERMISSION.value,
  // )
  // @UseGuards(PermissionsGuard)
  @Query('findAllTransactionsByMerchantId')
  findAllByMerchantId(
    @Args('getAllTransactionDto') getAllTransactionDto: GetAllTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.transactionsService.findAllByMerchantId(getAllTransactionDto, user);
  }

  // @Permissions(
  //     transactionPermissions.ALL_PERMISSION.value,
  //     transactionPermissions.READ_PERMISSION.value,
  // )
  // @UseGuards(PermissionsGuard)
  @Query('findOneTransaction')
  findOne(@Args('transactionId') tranasactionId: string) {
    return this.transactionsService.findOne(tranasactionId);
  }

  @Permissions(transactionPermissions.ALL_PERMISSION.value, transactionPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('updateTransaction')
  update(
    @Args('transactionId') transactionId: string,
    @Args('updateTransactionDto') updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(transactionId, updateTransactionDto);
  }
}
