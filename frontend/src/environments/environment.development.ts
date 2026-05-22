import { getRuntimeConfig } from './runtime-config';

const runtimeConfig = getRuntimeConfig({
  apiBaseUrl: 'http://localhost:4000/api',
  assetBaseUrl: 'http://localhost:4000'
});

export const environment = {
  production: false,
  ...runtimeConfig
};
