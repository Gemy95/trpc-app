import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Public } from '../common/decorators';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { FindAllPaytabsTransactionsDto } from './dtos/findAll-paytabs-transaction.dto';
import { Patch } from '@nestjs/common/decorators';

@Controller('payment')
@ApiTags(swaggerResources.Payment)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @ApiQuery({
    name: 'transType',
    type: 'string',
    required: true,
  })
  @Get('/createPaymentPage')
  @ApiResponse({ description: 'Application', status: 201 })
  async create(@Query('transType') transType: string, @Res() res) {
    try {
      const result = await this.paymentService.createPaymentPage(
        ['all'],
        [transType || 'sale', 'ecom'],
        ['cart_22222', 'SAR', '100', 'test'],
        [
          'Client Shoppex',
          'email@domain.com',
          '0522222222',
          'address street',
          'Riyad',
          'Ar Riyad',
          'SA',
          '12211',
          '1.1.1.1',
        ],
        [
          'Client Shoppex',
          'email@domain.com',
          '0522222222',
          'address street',
          'Riyad',
          'Ar Riyad',
          'SA',
          '12211',
          '1.1.1.1',
        ],
        [
          /*'https://webhook.site/730acce0-e54e-4522-8a45-f9b8e44624b6', 'https://site.paytabs.com/en/'*/
        ],
        'en',
        true,
      );

      return res.redirect(result?.['redirect_url']);
    } catch (error) {
      throw new HttpException(error?.response?.data?.message || error?.message || error, 400);
    }
  }

  @Public()
  @ApiQuery({
    name: 'transRef',
    type: 'string',
    required: true,
  })
  @Get('/validateTransactionPayment')
  @ApiResponse({ description: 'Application', status: 201 })
  async validate(@Query('transRef') transRef: string) {
    try {
      const result = await this.paymentService.validatePayment(transRef);
      return result;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message || error?.message || error, 400);
    }
  }

  @Public()
  @ApiQuery({
    name: 'transType',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'transRef',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'cart_id',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'cart_currency',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'cart_amount',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'cart_description',
    type: 'string',
    required: false,
  })
  @Patch('/queryTransactionPayment')
  @ApiResponse({ description: 'Application', status: 200 })
  async queryTransaction(
    @Query('transType') transType: string,
    @Query('transRef') transRef: string,
    @Query('cart_id') cart_id: string,
    @Query('cart_currency') cart_currency: string,
    @Query('cart_amount') cart_amount: string,
    @Query('cart_description') cart_description?: string,
  ) {
    try {
      const result = await this.paymentService.queryTransaction(
        [transRef, transType, 'ecom'],
        [cart_id, cart_currency, cart_amount, cart_description],
      );
      return result;
    } catch (error) {
      // if (error.response.data.message == 'Unable to process your request') {
      //   throw new HttpException(ERROR_CODES.err_payment_unable_to_process_your_refund, 400);
      // }
      throw new HttpException(error?.response?.data?.message || error?.message || error, 400);
    }
  }

  @Public()
  @Get('/findAllPaytabsTransactions')
  @ApiResponse({ description: 'Application', status: 201 })
  async findAllPaytabsTransactions(@Query() params: FindAllPaytabsTransactionsDto) {
    try {
      const result = await this.paymentService.findAllPaytabsTransactions(params);
      return result;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message || error?.message || error, 400);
    }
  }

  @Public()
  @ApiQuery({
    name: 'transId',
    type: 'string',
    required: true,
  })
  @Get('/findOnePaytabsTransaction')
  @ApiResponse({ description: 'Application', status: 201 })
  async findOnePaytabsTransaction(@Query('transId') transId: string) {
    try {
      const result = await this.paymentService.findOnePaytabsTransaction(transId);
      return result;
    } catch (error) {
      throw new HttpException(error?.response?.data?.message || error?.message || error, 400);
    }
  }
}
