const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const { services, businesses, actionLogs, users } = require('./data/mockData');

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

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Telegram Bot Token (get from @BotFather on Telegram)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';

// AI response simulator
const generateAIResponse = (message, userId) => {
  const lowerMessage = message.toLowerCase();
  
  console.log(`🤖 Processing Telegram message: "${message}" from user: ${userId}`);
  
  // Price update detection
  if (lowerMessage.includes('increase') || lowerMessage.includes('decrease') || lowerMessage.includes('change price')) {
    const priceMatch = message.match(/\$(\d+)/g);
    if (priceMatch && priceMatch.length >= 2) {
      const oldPrice = parseInt(priceMatch[0].replace('$', ''));
      const newPrice = parseInt(priceMatch[1].replace('$', ''));
      
      const logEntry = {
        id: `log${Date.now()}`,
        action: 'price_update',
        description: `Updated service from $${oldPrice} to $${newPrice}`,
        timestamp: new Date().toISOString(),
        source: 'telegram',
        details: { oldPrice, newPrice }
      };
      
      if (!actionLogs[userId]) {
        actionLogs[userId] = [];
      }
      actionLogs[userId].unshift(logEntry);
      
      console.log(`✅ Updated price: $${oldPrice} → $${newPrice}`);
      return `✅ Got it! Updated service from $${oldPrice} to $${newPrice}.`;
    }
  }
  
  // Help command
  if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
    return `🤖 **Chatherine Bot Commands:**
    
💰 **Price Updates:**
• "Increase [service] from $[old] to $[new]"
• "Change [service] price to $[amount]"

⏰ **Hours Management:**
• "Close [day] for private event"
• "Open [day] from [time] to [time]"

➕ **Service Management:**
• "Add [service] for $[price], [duration] minutes"

📊 **Business Info:**
• "Show my services"
• "Show business hours"

Type any command and I'll update your business automatically!`;
  }
  
  // Default response
  return `🤔 I understand you want to: "${message}". 

Type "help" to see all available commands, or try:
• "Increase facial from $100 to $120"
• "Close Friday for private event"`;
};

// Send message to Telegram
const sendTelegramMessage = async (chatId, message) => {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log(`📤 Sent Telegram message to ${chatId}`);
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
};

// Telegram webhook endpoint
app.post('/webhook/telegram', limiter, async (req, res) => {
  const update = req.body;
  
  if (update.message) {
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id.toString();
    
    console.log(`📱 Telegram message from ${chatId}: "${text}"`);
    
    // Generate AI response
    const aiResponse = generateAIResponse(text, userId);
    
    // Send response
    await sendTelegramMessage(chatId, aiResponse);
  }
  
  res.status(200).send('OK');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Chatherine Telegram Bot',
    version: '1.0.0'
  });
});

// Root endpoint - bot info
app.get('/', (req, res) => {
  res.json({
    bot: 'Chatherine Telegram Bot',
    description: 'Your business, updated by text.',
    status: 'running',
    webhook: '/webhook/telegram',
    health: '/health',
    setup: {
      step1: 'Create bot with @BotFather on Telegram',
      step2: 'Get bot token and add to .env file',
      step3: 'Set webhook URL to your-domain.com/webhook/telegram'
    }
  });
});

// Set webhook endpoint
app.post('/set-webhook', async (req, res) => {
  const { webhookUrl } = req.body;
  
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      url: webhookUrl
    });
    
    res.json({ 
      success: true, 
      message: `Webhook set to ${webhookUrl}` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
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
  console.log(`🤖 Chatherine Telegram Bot running on port ${PORT}`);
  console.log(`📱 Telegram webhook: http://localhost:${PORT}/webhook/telegram`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Bot info: http://localhost:${PORT}/`);
  console.log('');
  console.log('🚀 Bot is ready to receive Telegram messages!');
  console.log('');
  console.log('📝 Setup Instructions:');
  console.log('1. Create a bot with @BotFather on Telegram');
  console.log('2. Get your bot token');
  console.log('3. Add TELEGRAM_BOT_TOKEN to .env file');
  console.log('4. Set webhook: POST /set-webhook with webhookUrl');
});

module.exports = app;