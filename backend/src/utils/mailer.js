import env from '../config/env.js';
import ApiError from './ApiError.js';
import { getPromailerErrorDetails, sendPromailerEmail } from './promailer.js';

const PROMAILER_PROVIDER = 'promailer';
export const EMAIL_SERVICE_UNAVAILABLE_MESSAGE =
  'Email service is temporarily unavailable. Please try again later.';

let providerConfigured = false;
let lastEmailTransportError = null;

const getDeliveryMode = () => {
  if (env.emailProvider === PROMAILER_PROVIDER || env.promailerApiKey) {
    return PROMAILER_PROVIDER;
  }

  return 'disabled';
};

const getLegacyEmailWarnings = () => {
  const warnings = [];
  const legacyVars = [
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_SECURE',
    'SMTP_SERVICE',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM'
  ];
  const hasLegacyEmailConfig = legacyVars.some((key) => {
    const value = process.env[key];
    return typeof value === 'string' && value.trim() !== '';
  });

  if (hasLegacyEmailConfig) {
    warnings.push(
      'Legacy SMTP/Resend email variables are present but ignored because EMAIL_PROVIDER=promailer.'
    );
  }

  return warnings;
};

export const isEmailDeliveryConfigured = () =>
  Boolean(env.promailerApiKey && env.promailerFromEmail);

export const getEmailDeliveryStatus = () => {
  const missing = [];
  const warnings = [];
  const mode = getDeliveryMode();

  if (mode !== PROMAILER_PROVIDER) {
    missing.push('EMAIL_PROVIDER=promailer');
  }

  if (!env.promailerApiKey) {
    missing.push('PROMAILER_API_KEY');
  }

  if (!env.promailerFromEmail) {
    missing.push('PROMAILER_FROM_EMAIL');
  }

  warnings.push(...getLegacyEmailWarnings());

  return {
    configured: missing.length === 0,
    mode,
    missing,
    warnings,
    summary: {
      provider: mode === PROMAILER_PROVIDER ? PROMAILER_PROVIDER : null,
      fromEmail: env.promailerFromEmail || null,
      fromName: env.promailerFromName || null
    }
  };
};

export const getEmailErrorDetails = (error) => {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const details = {
    message: error.message
  };

  if ('code' in error && error.code) {
    details.code = error.code;
  }

  if ('command' in error && error.command) {
    details.command = error.command;
  }

  if ('responseCode' in error && error.responseCode) {
    details.responseCode = error.responseCode;
  }

  return details;
};

export const getEmailTransportLogContext = () => ({
  provider: env.emailProvider || null,
  fromEmail: env.promailerFromEmail || null,
  fromName: env.promailerFromName || null
});

export const getEmailDeliveryHealth = () => {
  const status = getEmailDeliveryStatus();

  return {
    configured: status.configured,
    mode: status.mode,
    missing: status.missing,
    warnings: status.warnings,
    ready: status.configured && providerConfigured && !lastEmailTransportError,
    lastError: lastEmailTransportError
  };
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const createEmailContent = ({ name, otp, expiresInMinutes }) => {
  const safeName = escapeHtml(name);

  return {
    text: `Hello ${name}, your OTP is ${otp}. Do not share it with anyone. It expires in ${expiresInMinutes} minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;padding:24px">
        <div style="margin-bottom:20px">
          <p style="margin:0;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#64748b">Uttarakhand Succulent</p>
          <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#214b37">Your OTP Code</h1>
        </div>
        <p style="margin:0 0 12px">Hello ${safeName},</p>
        <p style="margin:0 0 18px">Your verification OTP is:</p>
        <div style="margin:0 0 18px;padding:18px 20px;border-radius:16px;background:#f5efe4;border:1px solid #d9d0c2;text-align:center">
          <div style="font-size:36px;font-weight:700;letter-spacing:0.34em;color:#214b37">${otp}</div>
        </div>
        <p style="margin:0 0 8px;font-weight:600;color:#991b1b">Do not share this OTP with anyone.</p>
        <p style="margin:0 0 12px">This OTP expires in ${expiresInMinutes} minutes.</p>
        <p style="margin:0;color:#64748b;font-size:14px">If you did not request this code, you can ignore this email.</p>
      </div>
    `
  };
};

export const verifyEmailTransport = async () => {
  if (!isEmailDeliveryConfigured()) {
    throw new ApiError(503, EMAIL_SERVICE_UNAVAILABLE_MESSAGE);
  }

  providerConfigured = true;
  lastEmailTransportError = null;

  return null;
};

export const sendOtpEmail = async (email, otp, options = {}) => {
  const content = createEmailContent({
    name: options.name || 'Customer',
    otp,
    expiresInMinutes: options.expiresInMinutes ?? env.otpExpiresMinutes
  });

  return sendPromailerEmail({
    to: email,
    subject: 'Your OTP Code - Uttarakhand Succulent',
    html: content.html,
    text: content.text
  });
};

export const sendRegistrationOtpEmail = async ({ email, name, otp, expiresInMinutes }) => {
  try {
    await sendOtpEmail(email, otp, {
      name,
      expiresInMinutes
    });
    providerConfigured = true;
    lastEmailTransportError = null;
  } catch (error) {
    lastEmailTransportError = getPromailerErrorDetails(error);
    providerConfigured = false;
    throw error;
  }
};
