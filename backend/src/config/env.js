import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.resolve(__dirname, '../../.env');
const localEnvFilePath = path.resolve(__dirname, '../../.env.local');

dotenv.config({ path: localEnvFilePath });
dotenv.config({ path: envFilePath });

const parseBoolean = (value, fallback) =>
  typeof value === 'string' ? value === 'true' : fallback;
const parseList = (value) =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((entry) => entry.trim().replace(/\/+$/, ''))
        .filter(Boolean)
    : [];

const smtpPort = Number(process.env.SMTP_PORT || 587);
const nodeEnv = process.env.NODE_ENV || 'development';
const databaseUrl =
  process.env.DATABASE_URL ||
  (nodeEnv === 'production'
    ? ''
    : 'postgresql://postgres:postgres@localhost:5432/nursery_store');

if (nodeEnv === 'production' && !databaseUrl) {
  throw new Error('DATABASE_URL is required in production.');
}

const configuredClientUrls = [
  ...parseList(process.env.CLIENT_URLS),
  ...parseList(process.env.CLIENT_URL)
];

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  clientUrls: configuredClientUrls.length > 0 ? configuredClientUrls : ['http://localhost:4200'],
  allowDevOtpInProduction: parseBoolean(process.env.ALLOW_DEV_OTP_IN_PRODUCTION, false),
  databaseUrl,
  databaseSsl: parseBoolean(process.env.DATABASE_SSL, nodeEnv === 'production'),
  databaseSslRejectUnauthorized: parseBoolean(
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED,
    false
  ),
  jwtSecret: process.env.JWT_SECRET || 'replace-with-a-long-random-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5242880),
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort,
  smtpSecure: parseBoolean(process.env.SMTP_SECURE, smtpPort === 465),
  smtpService: process.env.SMTP_SERVICE || '',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || '',
  otpExpiresMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 10)
};

export default env;
