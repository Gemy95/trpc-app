export default () => ({
  port: 8080,
  env: 'local',
  app: {
    name: 'Dev',
    version: 1.0,
  },
  common: {
    pageSize: 10,
    maxPageSize: 100,
  },
  slack: {
    token: 'xoxb-2153227509201-2496163215443-3ItZBzeeXQBCPVRX3sMnd5Qx',
    channels: {
      registration: 'C02EL4YU7T5',
      forgetPassword: 'C02EYBQTX8D',
      userUpdates: 'C02J8M5GS6R',
    },
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
  SHOPPEX_WALLET_ID: '61f7fd98db249e09b7e47329',
  authentication: {
    key: process.env.JWT_SECRET_KEY,
    expiry: process.env.JWT_EXPIRATION,
    ACCESS_TOKEN_ADMIN_PUBLIC_KEY: process.env.ACCESS_TOKEN_ADMIN_PUBLIC_KEY,
    ACCESS_TOKEN_ADMIN_PRIVATE_KEY: process.env.ACCESS_TOKEN_ADMIN_PRIVATE_KEY,
    ACCESS_TOKEN_ADMIN_EXPIRY_IN: process.env.ACCESS_TOKEN_ADMIN_EXPIRY_IN,

    REFRESH_TOKEN_ADMIN_PUBLIC_KEY: process.env.REFRESH_TOKEN_ADMIN_PUBLIC_KEY,
    REFRESH_TOKEN_ADMIN_PRIVATE_KEY: process.env.REFRESH_TOKEN_ADMIN_PRIVATE_KEY,
    REFRESH_TOKEN_ADMIN_EXPIRY_IN: process.env.REFRESH_TOKEN_ADMIN_EXPIRY_IN,

    ACCESS_TOKEN_CLIENT_PUBLIC_KEY: process.env.ACCESS_TOKEN_CLIENT_PUBLIC_KEY,
    ACCESS_TOKEN_CLIENT_PRIVATE_KEY: process.env.ACCESS_TOKEN_CLIENT_PRIVATE_KEY,
    ACCESS_TOKEN_CLIENT_EXPIRY_IN: process.env.ACCESS_TOKEN_CLIENT_EXPIRY_IN,

    REFRESH_TOKEN_CLIENT_PUBLIC_KEY: process.env.REFRESH_TOKEN_CLIENT_PUBLIC_KEY,
    REFRESH_TOKEN_CLIENT_PRIVATE_KEY: process.env.REFRESH_TOKEN_CLIENT_PRIVATE_KEY,
    REFRESH_TOKEN_CLIENT_EXPIRY_IN: process.env.REFRESH_TOKEN_CLIENT_EXPIRY_IN,

    ACCESS_TOKEN_OWNER_PUBLIC_KEY: process.env.ACCESS_TOKEN_OWNER_PUBLIC_KEY,
    ACCESS_TOKEN_OWNER_PRIVATE_KEY: process.env.ACCESS_TOKEN_OWNER_PRIVATE_KEY,
    ACCESS_TOKEN_OWNER_EXPIRY_IN: process.env.ACCESS_TOKEN_OWNER_EXPIRY_IN,

    REFRESH_TOKEN_OWNER_PUBLIC_KEY: process.env.REFRESH_TOKEN_OWNER_PUBLIC_KEY,
    REFRESH_TOKEN_OWNER_PRIVATE_KEY: process.env.REFRESH_TOKEN_OWNER_PRIVATE_KEY,
    REFRESH_TOKEN_OWNER_EXPIRY_IN: process.env.REFRESH_TOKEN_OWNER_EXPIRY_IN,
  },
  storage: {
    accessKey: process.env.AWS_S3_ACCESS_KEY_ID,
    secretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    baseUrl: process.env.AWS_S3_URL,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_S3_REGION,
    folder: process.env.AWS_S3_FOLDER,
  },
  onesignal: {
    // * FOR CLIENT DEV
    CLIENT_APP_ID: process.env.CLIENT_APP_ID,
    CLIENT_REST_API_KEY: process.env.CLIENT_REST_API_KEY,

    // * FOR SHOPPEX DEV
    SHOPPEX_EMPLOYEE_APP_ID: process.env.SHOPPEX_EMPLOYEE_APP_ID,
    SHOPPEX_EMPLOYEE_API_KEY: process.env.SHOPPEX_EMPLOYEE_API_KEY,

    // * FOR MERCHANT DEV
    SHOPPEX_MERCHANT_APP_ID: process.env.SHOPPEX_MERCHANT_APP_ID,
    SHOPPEX_MERCHANT_API_KEY: process.env.SHOPPEX_MERCHANT_API_KEY,
  },
  redis: {
    REDIS_HOST: 'localhost',
    REDIS_URL: 'localhost',
    REDIS_PORT: '6379',
  },

  sentry: {
    DSN: 'https://2ad96298ae14445dbafa24d24361d609@o988418.ingest.sentry.io/4503904434520064',
    tracesSampleRate: 1.0,
    debug: true,
  },

  paytabs: {
    profileId: process.env.PAYTABS_PROFILE_ID,
    serverKey: process.env.PAYTABS_SERVER_KEY,
    region: process.env.PAYTABS_REGION,
  },

  merchantWebsiteUrl: process.env.MERCHANT_WEBSITE_URL,
});
