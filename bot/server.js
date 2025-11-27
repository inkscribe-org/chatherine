const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const telegramRoutes = require('./routes/telegram');
const businessRoutes = require('./routes/business');
const authRoutes = require('./routes/auth');
console.log('Telegram routes loaded:', typeof telegramRoutes);
console.log('Business routes loaded:', typeof businessRoutes);
console.log('Auth routes loaded:', typeof authRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://app.yourdomain.com'] // TODO: Replace with chatherine's real domain
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: {
    error: 'Too many webhook requests, please try again later.'
  }
});
app.use('/webhook/', webhookLimiter);



app.use('/webhook/telegram', telegramRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

app.post('/api/chat', async (req, res) => {
  try {
    const axios = require('axios');
    const backendUrl = 'http://localhost:8000/api/chat';
    const response = await axios.post(backendUrl, req.body, {
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Chat proxy error:', error.message);
    res.status(502).json({ error: 'Backend service unavailable' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Chatherine Telegram Bot',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    bot: 'Chatherine Telegram Bot',
    description: 'Your business, updated by text.',
    status: 'running',
    webhook: '/webhook/telegram',
    health: '/health',
    commands: [
      'Increase [service] from $[old] to $[new]',
      'Close [day] for private event',
      'Add [service] for $[price], [duration] minutes',
      'Update [day] hours: [time] to [time]'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log("bot running on telegram")
});

module.exports = app;
