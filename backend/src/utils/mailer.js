import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';
import env from '../config/env.js';
import ApiError from './ApiError.js';

const RESEND_API_URL = 'https://api.resend.com/emails';

let transporter = null;
let transporterVerified = false;
let lastEmailTransportError = null;

const getDeliveryMode = () => {
  if (env.resendApiKey) {
    return 'resend';
  }

  if (env.smtpHost) {
    return 'host';
  }

  if (env.smtpService) {
    return 'service';
  }

  return 'disabled';
};

export const isEmailDeliveryConfigured = () =>
  Boolean(
    (env.resendApiKey && env.emailFrom) ||
      ((env.smtpService || env.smtpHost) && env.smtpUser && env.smtpPass && env.emailFrom)
  );

export const getEmailDeliveryStatus = () => {
  const missing = [];
  const warnings = [];
  const mode = getDeliveryMode();
  const hasSmtpConfig = Boolean(env.smtpHost || env.smtpService);

  if (mode === 'resend') {
    if (!env.emailFrom) {
      missing.push('EMAIL_FROM');
    }

    if (env.smtpHost || env.smtpService || env.smtpUser || env.smtpPass) {
      warnings.push('RESEND_API_KEY is set, so SMTP configuration is ignored.');
    }
  } else {
    if (!env.resendApiKey && !hasSmtpConfig) {
      missing.push('RESEND_API_KEY or SMTP_SERVICE or SMTP_HOST');
      if (!env.emailFrom) {
        missing.push('EMAIL_FROM or SMTP_FROM');
      }
    } else {
      if (env.smtpHost && env.smtpService) {
        warnings.push('SMTP_HOST is set, so SMTP_SERVICE is ignored and host mode is used.');
      }

      if (!env.smtpUser) {
        missing.push('SMTP_USER');
      }

      if (!env.smtpPass) {
        missing.push('SMTP_PASS');
      }

      if (!env.emailFrom) {
        missing.push('EMAIL_FROM or SMTP_FROM');
      }

      if (!env.smtpService && env.smtpHost && env.smtpPort === 465 && !env.smtpSecure) {
        warnings.push('SMTP_PORT is 465 with SMTP_SECURE=false. Prefer SMTP_PORT=587 and SMTP_SECURE=false on Render.');
      }
    }
  }

  return {
    configured: missing.length === 0,
    mode,
    missing,
    warnings,
    summary: {
      provider: mode,
      service: mode === 'service' ? env.smtpService || null : null,
      host: mode === 'host' ? env.smtpHost || null : null,
      port: mode === 'host' ? env.smtpPort : null,
      secure: mode === 'host' ? env.smtpSecure : null,
      user: mode === 'resend' ? null : env.smtpUser || null,
      from: env.emailFrom || null
    }
  };
};

export const getEmailErrorDetails = (error) => {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const details = {
    name: error.name,
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

  if ('response' in error && error.response) {
    details.response = error.response;
  }

  return details;
};

export const getEmailDeliveryHealth = () => {
  const status = getEmailDeliveryStatus();

  return {
    configured: status.configured,
    mode: status.mode,
    missing: status.missing,
    warnings: status.warnings,
    ready: status.configured && transporterVerified && !lastEmailTransportError,
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
    text: `Hello ${name}, your verification code is ${otp}. It expires in ${expiresInMinutes} minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;padding:24px">
        <p style="margin:0 0 12px">Hello ${safeName},</p>
        <p style="margin:0 0 18px">Use the verification code below to complete your Nursery Store registration.</p>
        <div style="margin:0 0 18px;padding:16px 20px;border-radius:16px;background:#f5efe4;border:1px solid #d9d0c2;text-align:center">
          <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#5b4435;margin-bottom:8px">Verification code</div>
          <div style="font-size:32px;font-weight:700;letter-spacing:0.28em;color:#214b37">${otp}</div>
        </div>
        <p style="margin:0 0 12px">This code expires in ${expiresInMinutes} minutes.</p>
        <p style="margin:0;color:#64748b;font-size:14px">If you did not request this code, you can ignore this email.</p>
      </div>
    `
  };
};

const getHostTransportConfig = async () => {
  const transportConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
  const hostname = transportConfig.host;

  if (!hostname) {
    throw new ApiError(503, 'Email service not configured.');
  }

  const ipv4Addresses = await dns.resolve4(hostname).catch(() => []);
  const [ipv4Address] = ipv4Addresses;

  if (!ipv4Address) {
    return transportConfig;
  }

  return {
    ...transportConfig,
    host: ipv4Address,
    tls: {
      servername: hostname
    }
  };
};

const getTransporter = async () => {
  if (getDeliveryMode() === 'resend') {
    return null;
  }

  if (!isEmailDeliveryConfigured()) {
    throw new ApiError(
      503,
      'Email service not configured.'
    );
  }

  if (!transporter) {
    const transportConfig = env.smtpHost
      ? await getHostTransportConfig()
      : {
          service: env.smtpService,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass
          }
        };

    transporter = nodemailer.createTransport(transportConfig);
  }

  return transporter;
};

export const verifyEmailTransport = async () => {
  if (getDeliveryMode() === 'resend') {
    transporterVerified = true;
    lastEmailTransportError = null;
    return null;
  }

  const mailer = await getTransporter();

  if (!transporterVerified) {
    try {
      await mailer.verify();
      transporterVerified = true;
      lastEmailTransportError = null;
    } catch (error) {
      transporterVerified = false;
      lastEmailTransportError = getEmailErrorDetails(error);
      throw error;
    }
  }

  return mailer;
};

const sendViaResend = async ({ email, name, otp, expiresInMinutes }) => {
  const content = createEmailContent({ name, otp, expiresInMinutes });
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: [email],
      subject: 'Your Nursery Store verification code',
      text: content.text,
      html: content.html
    })
  });

  if (response.ok) {
    transporterVerified = true;
    lastEmailTransportError = null;
    return;
  }

  const responseText = await response.text();
  const error = new Error(`Resend API request failed with status ${response.status}.`);

  Object.assign(error, {
    code: 'RESEND_API_ERROR',
    command: 'SEND',
    responseCode: response.status,
    response: responseText
  });

  throw error;
};

export const sendRegistrationOtpEmail = async ({ email, name, otp, expiresInMinutes }) => {
  try {
    if (getDeliveryMode() === 'resend') {
      await sendViaResend({ email, name, otp, expiresInMinutes });
      return;
    }

    const mailer = await verifyEmailTransport();
    const content = createEmailContent({ name, otp, expiresInMinutes });

    await mailer.sendMail({
      from: env.emailFrom,
      to: email,
      subject: 'Your Nursery Store verification code',
      text: content.text,
      html: content.html
    });
    lastEmailTransportError = null;
  } catch (error) {
    lastEmailTransportError = getEmailErrorDetails(error);
    transporterVerified = false;
    throw error;
  }
};
