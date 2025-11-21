const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

const whatsappRoutes = require('./routes/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/webhook/', limiter);

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp webhook route
app.post('/webhook/whatsapp', whatsappRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Chathy WhatsApp Bot',
    version: '1.0.0'
  });
});

// Root endpoint - bot info
app.get('/', (req, res) => {
  res.json({
    bot: 'Chathy WhatsApp Bot',
    description: 'Your business, updated by text.',
    status: 'running',
    webhook: '/webhook/whatsapp',
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
  console.log(`🤖 Chathy WhatsApp Bot running on port ${PORT}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Bot info: http://localhost:${PORT}/`);
  console.log('');
  console.log('🚀 Bot is ready to receive WhatsApp messages!');
});

module.exports = app;