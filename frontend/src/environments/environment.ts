import { getRuntimeConfig } from './runtime-config';

const runtimeConfig = getRuntimeConfig({
  apiBaseUrl: 'https://nursery-backend-csj3.onrender.com/api',
  assetBaseUrl: 'https://nursery-backend-csj3.onrender.com'
});

export const environment = {
  production: true,
  ...runtimeConfig
};
