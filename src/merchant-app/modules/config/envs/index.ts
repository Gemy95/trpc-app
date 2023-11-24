import development from './config.dev';
import production from './config.prod';
import local from './config.local';

const env = process.env['NODE' + '_ENV'] || 'development';
const configurations = {
  development,
  local,
  production,
};
const config = configurations[env];

export default config;
