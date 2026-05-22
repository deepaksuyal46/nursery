import app from './app.js';
import { ensurePendingRegistrationsTable } from './config/bootstrap.js';
import db from './config/db.js';
import {
  getEmailDeliveryStatus,
  getEmailErrorDetails,
  getEmailTransportLogContext,
  verifyEmailTransport
} from './utils/mailer.js';

let server = null;
const PORT = process.env.PORT || 5000;

const verifyEmailTransportInBackground = () => {
  void verifyEmailTransport()
    .then(() => {
      console.info('Email delivery transport verified.', getEmailTransportLogContext());
    })
    .catch((error) => {
      console.error('Email delivery transport verification failed', {
        ...getEmailTransportLogContext(),
        ...getEmailErrorDetails(error)
      });
    });
};

const start = async () => {
  await ensurePendingRegistrationsTable();
  const emailStatus = getEmailDeliveryStatus();

  if (!emailStatus.configured) {
    console.warn('Email service not configured', {
      missing: emailStatus.missing
    });
  } else {
    emailStatus.warnings.forEach((warning) => {
      console.warn(warning);
    });
  }

  server = app.listen(Number(PORT), () => {
    console.log(`Nursery backend listening on port ${PORT}`);

    if (emailStatus.configured) {
      verifyEmailTransportInBackground();
    }
  });
};

const shutdown = async () => {
  if (!server) {
    await db.end();
    process.exit(0);
    return;
  }

  server.close(async () => {
    await db.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection', error);
});

start().catch(async (error) => {
  console.error('Failed to start backend', error);
  await db.end();
  process.exit(1);
});
