import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import db from './config/db.js';
import env from './config/env.js';
import { getEmailDeliveryHealth } from './utils/mailer.js';
import { attachDatabase } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import router from './routes/index.js';

const app = express();

const allowedOrigins = new Set(
    [...env.clientUrls, 'http://localhost:4200', 'http://127.0.0.1:4200']
        .map((origin) => origin.trim().replace(/\/+$/, ''))
        .filter(Boolean)
);

app.use(
    cors({
        origin: (origin, callback) => {
            const normalizedOrigin = origin?.trim().replace(/\/+$/, '');

            if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true
    })
);

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(attachDatabase(db));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            email: getEmailDeliveryHealth()
        }
    });
});

app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

export default app;
