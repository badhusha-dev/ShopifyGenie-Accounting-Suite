import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import shopifyRoutes from './routes/shopify';
import accountingRoutes from './routes/accounting';
import reportsRoutes from './routes/reports';
import reconciliationRoutes from './routes/reconciliation';
import advancedReportsRoutes from './routes/advancedReports';
import settingsRoutes from './routes/settings';

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// ===== SECURITY MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// ===== CORS CONFIGURATION =====
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ===== BODY PARSING =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== COMPRESSION =====
app.use(compression());

// ===== LOGGING =====
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShopifyGenie Accounting Suite Pro - API</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .container {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 600px;
        }
        h1 { font-size: 2.5em; margin: 0 0 8px; font-weight: 700; }
        .tagline { font-size: 1.2em; opacity: 0.9; margin-bottom: 32px; }
        .status { 
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 16px;
          margin: 24px 0;
        }
        .endpoints {
          text-align: left;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
        }
        .endpoints h3 { margin-top: 0; }
        .endpoints code {
          background: rgba(255,255,255,0.1);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
        }
        .emoji { font-size: 3em; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">🧞‍♂️</div>
        <h1>ShopifyGenie Accounting Suite Pro</h1>
        <div class="tagline">Shopify + Accounting. Reinvented. ✨</div>
        <div class="status">
          <strong>🚀 API is running smoothly!</strong>
        </div>
        <div class="endpoints">
          <h3>📡 Available Endpoints:</h3>
          <p><code>GET /health</code> - Health check</p>
          <p><code>POST /api/auth/login</code> - Authentication</p>
          <p><code>GET /api/reports/dashboard</code> - Dashboard stats</p>
          <p><code>GET /api/shopify/stores</code> - Shopify stores</p>
          <p><code>GET /api/accounting/accounts</code> - Chart of accounts</p>
        </div>
        <p style="margin-top: 32px; opacity: 0.7; font-size: 0.9em;">
          Environment: ${process.env.NODE_ENV || 'development'}<br>
          Version: 2.0.0 Pro
        </p>
      </div>
    </body>
    </html>
  `);
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '2.0.0-pro',
  });
});

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/reports/advanced', advancedReportsRoutes);
app.use('/api/settings', settingsRoutes);

// ===== STATIC FILES =====
app.use('/uploads', express.static('uploads'));

// ===== ERROR HANDLING =====
app.use(notFound);
app.use(errorHandler);

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// ===== UNHANDLED REJECTIONS =====
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// ===== START SERVER =====
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
