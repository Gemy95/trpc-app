import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientRepository, MerchantRepository } from '../models';
import { Client } from 'onesignal-node';
import { MailService } from '../mail/mail.service';
import { FindDashboardMerchantsStatisticsDto } from './dto/dashboard-merchant-statistics.dto';
import { ClientService } from '../client/client.service';

@Injectable()
export class DashboardMerchantService {
  constructor(
    @Inject('ADMIN_ONESIGNAL') private readonly oneSignal: Client,
    private readonly merchantRepository: MerchantRepository,
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
  ) {}

  private logger = new Logger(DashboardMerchantService.name);

  public async getDashboardMerchantsStatistics(
    findDashboardMerchantsStatisticsDto: FindDashboardMerchantsStatisticsDto,
  ) {
    const clients = await this.clientService.dashboardClientsStatistics();
    const results = await this.merchantRepository.getDashboardMerchantsStatistics(findDashboardMerchantsStatisticsDto);
    return { ...results, clients };
  }
}
