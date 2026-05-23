import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'src', 'assets', 'runtime-config.js');

const apiBaseUrl =
  process.env.FRONTEND_API_BASE_URL ||
  process.env.NG_APP_API_BASE_URL ||
  'https://nursery-backend-csj3.onrender.com/api';
const assetBaseUrl =
  process.env.FRONTEND_ASSET_BASE_URL ||
  process.env.NG_APP_ASSET_BASE_URL ||
  'https://nursery-backend-csj3.onrender.com';

const fileContents = `window.__NURSERY_RUNTIME_CONFIG__ = ${JSON.stringify(
  {
    apiBaseUrl,
    assetBaseUrl
  },
  null,
  2
)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContents, 'utf8');
