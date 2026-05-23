import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import db from './config/db.js';
import env from './config/env.js';
import { attachDatabase } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import router from './routes/index.js';

const app = express();
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = [...new Set([...env.clientUrls, env.clientUrl, 'http://localhost:3000'])]
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : null;

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
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
app.get('/', (_req, res) => {
  res.send('Nursery backend is running');
});
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Nursery backend is running'
  });
});
app.use(attachDatabase(db));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

export default app;
