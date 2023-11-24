import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigurationService } from '../config/configuration.service';
import { PaytabsTransactionRepository } from '../models';
import { FindAllPaytabsTransactionsDto } from './dtos/findAll-paytabs-transaction.dto';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigurationService,
    private paytabsTransactionRepository: PaytabsTransactionRepository,
  ) {}

  async createPaymentPage(payment_code, transaction, cart, customer, shipping, urls, lang, framed = false) {
    payment_code = { payment_methods: payment_code };
    transaction = { tran_type: transaction[0], tran_class: transaction[1] };
    cart = { cart_id: cart[0], cart_currency: cart[1], cart_amount: parseFloat(cart[2]), cart_description: cart[3] };
    const customer_details = {
      name: customer[0],
      email: customer[1],
      phone: customer[2],
      street1: customer[3],
      city: customer[4],
      state: customer[5],
      country: customer[6],
      zip: customer[7],
      ip: customer[8],
    };
    const shipping_details = {
      name: shipping[0],
      email: shipping[1],
      phone: shipping[2],
      street1: shipping[3],
      city: shipping[4],
      state: shipping[5],
      country: shipping[6],
      zip: shipping[7],
      ip: shipping[8],
    };
    const paypage_lang = lang;
    const callback = urls[0];
    const return_url = urls[1];
    const data = {
      profile_id: this.configService.paytabs.profileId,
      payment_methods: payment_code['payment_methods'],
      tran_type: transaction['tran_type'],
      tran_class: transaction['tran_class'],
      cart_id: cart['cart_id'],
      cart_currency: cart['cart_currency'],
      cart_amount: cart['cart_amount'],
      cart_description: cart['cart_description'],
      paypage_lang: paypage_lang,
      customer_details: customer_details,
      shipping_details: shipping_details,
      callback: callback,
      return: return_url,
      framed: framed,
      user_defined: {
        package: 'node.js PT2 V2.0.0',
      },
    };
    const url = this._setEndPoint(this.configService.paytabs.region) + 'payment/request';
    const result = await this._sendPost(url, data);
    await this.paytabsTransactionRepository.create(result);
    return result;
  }

  validatePayment(tranRef) {
    const data = {
      profile_id: this.configService.paytabs.profileId,
      tran_ref: tranRef,
    };
    const url = this._setEndPoint(this.configService.paytabs.region) + 'payment/query';
    return this._sendPost(url, data);
  }

  async queryTransaction(transaction, cart) {
    transaction = { tran_ref: transaction[0], tran_type: transaction[1], tran_class: transaction[2] };
    cart = { cart_id: cart[0], cart_currency: cart[1], cart_amount: parseFloat(cart[2]), cart_description: cart[3] };
    const data = {
      profile_id: this.configService.paytabs.profileId,
      tran_ref: transaction['tran_ref'],
      tran_type: transaction['tran_type'],
      tran_class: transaction['tran_class'],
      cart_id: cart['cart_id'],
      cart_currency: cart['cart_currency'],
      cart_amount: cart['cart_amount'],
      cart_description: cart['cart_description'] || '',
    };
    const url = this._setEndPoint(this.configService.paytabs.region) + 'payment/request';
    const result = await this._sendPost(url, data);
    await this.paytabsTransactionRepository.create(result);
    return result;
  }

  async _sendPost(url, objData) {
    // const sendData = {
    //   method: 'post',
    //   url: url,
    //   headers: {
    //     authorization: this.configService.paytabs.serverKey,
    //   },
    //   data: objData,
    // };

    return axios({
      method: 'post',
      url: url,
      headers: {
        authorization: this.configService.paytabs.serverKey,
      },
      data: objData,
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  }

  _setEndPoint(region) {
    const regions_urls = {
      ARE: 'https://secure.paytabs.com/',
      SAU: 'https://secure.paytabs.sa/',
      OMN: 'https://secure-oman.paytabs.com/',
      JOR: 'https://secure-jordan.paytabs.com/',
      EGY: 'https://secure-egypt.paytabs.com/',
      GLOBAL: 'https://secure-global.paytabs.com/',
    };

    for (const [key, value] of Object.entries(regions_urls)) {
      if (key === region) {
        return value;
      }
    }
  }

  async findAllPaytabsTransactions(params: FindAllPaytabsTransactionsDto) {
    return this.paytabsTransactionRepository.getAll(params);
  }

  async findOnePaytabsTransaction(paytabsTransactionId: string) {
    return this.paytabsTransactionRepository.getOne(paytabsTransactionId);
  }
}
