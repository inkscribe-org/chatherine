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

// Security middleware (temporarily disabled for testing)
// app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting (temporarily disabled for testing)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/webhook/', limiter);



// Telegram webhook route
app.use('/webhook/telegram', telegramRoutes);

// Auth API routes
app.use('/api/auth', authRoutes);

// Business API routes
app.use('/api/business', businessRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Chathy Telegram Bot',
    version: '1.0.0'
  });
});

// Root endpoint - bot info
app.get('/', (req, res) => {
  res.json({
    bot: 'Chathy Telegram Bot',
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🤖 Chathy Telegram Bot running on port ${PORT}`);
  console.log(`📱 Telegram webhook: http://localhost:${PORT}/webhook/telegram`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Bot info: http://localhost:${PORT}/`);
  console.log('');
  console.log('🚀 Bot is ready to receive Telegram messages!');
});

module.exports = app;