import axios from 'axios';
import env from '../config/env.js';

const PROMAILER_SEND_URL = 'https://mailserver.automationlounge.com/api/v1/messages/send';
const PROMAILER_TIMEOUT_MS = 60_000;

const serializeResponseData = (value) => {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const quoteDisplayName = (value) => value.replaceAll('"', '\\"');

const formatFromAddress = () =>
  env.promailerFromName
    ? `"${quoteDisplayName(env.promailerFromName)}" <${env.promailerFromEmail}>`
    : env.promailerFromEmail;

export const getPromailerErrorDetails = (error) => {
  if (!error || typeof error !== 'object') {
    return { message: String(error) };
  }

  const details = {
    message: error.message || 'Promailer email request failed.'
  };

  if ('code' in error && error.code) {
    details.code = error.code;
  }

  if ('responseCode' in error && error.responseCode) {
    details.responseCode = error.responseCode;
  }

  if ('command' in error && error.command) {
    details.command = error.command;
  }

  if ('responseBody' in error && error.responseBody) {
    details.responseBody = error.responseBody;
  }

  return details;
};

export const sendPromailerEmail = async ({ to, subject, html, text }) => {
  try {
    const response = await axios.post(
      PROMAILER_SEND_URL,
      {
        to,
        from: formatFromAddress(),
        subject,
        html,
        text
      },
      {
        headers: {
          Authorization: `Bearer ${env.promailerApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: PROMAILER_TIMEOUT_MS
      }
    );

    return response.data;
  } catch (error) {
    const responseCode = error.response?.status || null;
    const responseBody = serializeResponseData(error.response?.data);
    const promailerError = new Error('Promailer email request failed.');

    Object.assign(promailerError, {
      code: error.code || 'PROMAILER_SEND_FAILED',
      command: 'SEND',
      responseCode,
      responseBody,
      cause: error
    });

    console.error('Promailer email send failed', {
      endpoint: PROMAILER_SEND_URL,
      provider: env.emailProvider || 'promailer',
      fromEmail: env.promailerFromEmail || null,
      to,
      subject,
      ...getPromailerErrorDetails(promailerError)
    });

    throw promailerError;
  }
};
