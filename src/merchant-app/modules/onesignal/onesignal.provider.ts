import * as OneSignal from 'onesignal-node';
import { ConfigurationService } from '../config/configuration.service';

export const clientOneSignalProvider = {
  provide: 'CLIENT_ONESIGNAL',
  useFactory: (configService: ConfigurationService) => {
    const { CLIENT_APP_ID, CLIENT_REST_API_KEY } = configService.oneSignal;
    return new OneSignal.Client(CLIENT_APP_ID, CLIENT_REST_API_KEY);
  },
  inject: [ConfigurationService],
};

export const adminOneSignalProvider = {
  provide: 'ADMIN_ONESIGNAL',
  useFactory: (configService: ConfigurationService) => {
    const { SHOPPEX_EMPLOYEE_APP_ID, SHOPPEX_EMPLOYEE_API_KEY } = configService.oneSignal;
    return new OneSignal.Client(SHOPPEX_EMPLOYEE_APP_ID, SHOPPEX_EMPLOYEE_API_KEY);
  },
  inject: [ConfigurationService],
};

export const merchantOneSignalProvider = {
  provide: 'MERCHANT_ONESIGNAL',
  useFactory: (configService: ConfigurationService) => {
    const { SHOPPEX_MERCHANT_APP_ID, SHOPPEX_MERCHANT_API_KEY } = configService.oneSignal;
    return new OneSignal.Client(SHOPPEX_MERCHANT_APP_ID, SHOPPEX_MERCHANT_API_KEY);
  },
  inject: [ConfigurationService],
};
