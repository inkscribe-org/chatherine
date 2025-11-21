const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { services, businesses, actionLogs, users } = require('../data/mockData');

const router = express.Router();

// Initialize Telegram Bot
let telegramBot = null;
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
}

// AI response simulator (in real app, this would call an AI service)
const generateAIResponse = (message, businessId) => {
  const lowerMessage = message.toLowerCase();
  const businessServices = services[businessId] || [];
  const business = businesses[businessId];
  
  console.log(`🤖 Processing message: "${message}" for business: ${business?.name}`);
  
  // Price update detection
  if (lowerMessage.includes('increase') || lowerMessage.includes('decrease') || lowerMessage.includes('change price')) {
    const priceMatch = message.match(/\$(\d+)/g);
    if (priceMatch && priceMatch.length >= 2) {
      const oldPrice = parseInt(priceMatch[0].replace('$', ''));
      const newPrice = parseInt(priceMatch[1].replace('$', ''));
      
      // Find service being updated (simplified logic)
      const service = businessServices.find(s => 
        lowerMessage.includes(s.name.toLowerCase())
      );
      
      if (service) {
        // Update service price
        service.price = newPrice;
        
        // Log the action
        const logEntry = {
          id: `log${Date.now()}`,
          action: 'price_update',
          description: `Updated ${service.name} from $${oldPrice} to $${newPrice}`,
          timestamp: new Date().toISOString(),
          source: 'telegram',
          details: { oldPrice, newPrice, serviceId: service.id }
        };
        
        if (!actionLogs[businessId]) {
          actionLogs[businessId] = [];
        }
        actionLogs[businessId].unshift(logEntry);
        
        console.log(`✅ Updated ${service.name} price: $${oldPrice} → $${newPrice}`);
        return `✅ Got it! Updated the service '${service.name}' from $${oldPrice} to $${newPrice}.`;
      }
    }
  }
  
  // Hours update detection
  if (lowerMessage.includes('hours') || lowerMessage.includes('close') || lowerMessage.includes('open')) {
    if (lowerMessage.includes('friday') && lowerMessage.includes('close')) {
      const logEntry = {
        id: `log${Date.now()}`,
        action: 'hours_update',
        description: 'Updated Friday hours: Closed for private event',
        timestamp: new Date().toISOString(),
        source: 'telegram',
        details: { day: 'friday', isClosed: true }
      };
      
      if (!actionLogs[businessId]) {
        actionLogs[businessId] = [];
      }
      actionLogs[businessId].unshift(logEntry);
      
      console.log('✅ Updated Friday hours: Closed for private event');
      return `✅ Updated Friday hours: Closed for private event.`;
    }
  }
  
  // Service addition
  if (lowerMessage.includes('add') && (lowerMessage.includes('service') || lowerMessage.includes('menu'))) {
    const priceMatch = message.match(/\$(\d+)/);
    const durationMatch = message.match(/(\d+)\s*minutes?/);
    
    if (priceMatch && durationMatch) {
      const price = parseInt(priceMatch[1]);
      const duration = parseInt(durationMatch[1]);
      
      const logEntry = {
        id: `log${Date.now()}`,
        action: 'service_add',
        description: `Added new service: ${message}`,
        timestamp: new Date().toISOString(),
        source: 'telegram',
        details: { message, price, duration }
      };
      
      if (!actionLogs[businessId]) {
        actionLogs[businessId] = [];
      }
      actionLogs[businessId].unshift(logEntry);
      
      console.log(`✅ Added new service: $${price}, ${duration} minutes`);
      return `✅ I've added the new service with price $${price} and duration ${duration} minutes.`;
    }
  }
  
  // Help command
  if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
    return `🤖 **Chathy Bot Commands:**
    
💰 **Price Updates:**
• "Increase [service] from $[old] to $[new]"
• "Change [service] price to $[amount]"

⏰ **Hours Management:**
• "Close [day] for private event"
• "Open [day] from [time] to [time]"
• "Update [day] hours: [time] to [time]"

➕ **Service Management:**
• "Add [service] for $[price], [duration] minutes"
• "Remove [service] from menu"

📊 **Business Info:**
• "Show my services"
• "Show today's appointments"
• "Show business hours"

Type any command and I'll update your business automatically!`;
  }
  
  // Show services
  if (lowerMessage.includes('show') && lowerMessage.includes('service')) {
    if (businessServices.length > 0) {
      const serviceList = businessServices
        .filter(s => s.isActive)
        .map(s => `• ${s.name}: $${s.price} (${s.duration}min)`)
        .join('\n');
      
      console.log(`📋 Showing services for ${business?.name}`);
      return `📋 **Your Services:**\n\n${serviceList}`;
    } else {
      return '📋 You have no active services configured.';
    }
  }
  
  // Default response
  console.log(`❓ Unknown command: "${message}"`);
  return `🤔 I understand you want to: "${message}". 

Type "help" to see all available commands, or try:
• "Increase facial from $100 to $120"
• "Close Friday for private event"
• "Add massage for $80, 45 minutes"`;
};

// Telegram webhook endpoint
router.post('/', (req, res) => {
  const update = req.body;
  
  if (update.message) {
    const chatId = update.message.chat.id;
    const message = update.message.text;
    const userId = update.message.from.id.toString();
    
    console.log(`📱 Message received from ${chatId} (user ${userId}): "${message}"`);
    
    // Find user by Telegram ID (in real app, query database)
    const user = users.find(u => u.telegramId === userId);
    
    if (!user) {
      const welcomeMsg = `👋 Welcome to Chathy!

I'm your AI business assistant. I can help you update your business information through simple text messages.

To get started, please register your business at our website, or type "help" to see what I can do.

🤖 Your business, updated by text.`;
      
      sendTelegramMessage(chatId, welcomeMsg);
      return res.status(200).send('OK');
    }
    
    // Generate AI response
    const aiResponse = generateAIResponse(message, user.id);
    
    // Send response back to user
    sendTelegramMessage(chatId, aiResponse);
  }
  
  res.status(200).send('OK');
});

// Send Telegram message
const sendTelegramMessage = (chatId, message) => {
  try {
    if (!telegramBot) {
      console.log(`📤 Mock Telegram message to ${chatId}:`);
      console.log(message);
      return;
    }
    
    telegramBot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
};

// Test endpoint for webhook
router.get('/test', (req, res) => {
  res.json({
    message: 'Telegram webhook is working',
    timestamp: new Date().toISOString(),
    status: 'ready'
  });
});

// Get message history (for testing)
router.get('/history', (req, res) => {
  // In a real app, this would fetch from database
  const mockHistory = [
    {
      id: '1',
      direction: 'inbound',
      message: 'Increase full facial from $100 to $120.',
      timestamp: '2024-03-24T10:30:00Z',
      chatId: '123456789'
    },
    {
      id: '2',
      direction: 'outbound',
      message: '✅ Got it! Updated the service \'Full Facial Treatment\' from $100 to $120.',
      timestamp: '2024-03-24T10:31:00Z',
      chatId: '123456789'
    }
  ];

  res.json(mockHistory);
});

// Send message endpoint (for testing)
router.post('/send', (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Chat ID and message are required' });
    }

    sendTelegramMessage(chatId, message);

    res.json({
      message: 'Message sent successfully',
      chatId,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Set webhook endpoint
router.post('/set-webhook', (req, res) => {
  try {
    const { webhookUrl } = req.body;
    
    if (!telegramBot) {
      return res.status(500).json({ error: 'Telegram bot not initialized' });
    }
    
    telegramBot.setWebHook(webhookUrl)
      .then(() => {
        res.json({
          message: 'Webhook set successfully',
          webhookUrl
        });
      })
      .catch((error) => {
        console.error('Error setting webhook:', error);
        res.status(500).json({ error: 'Failed to set webhook' });
      });
  } catch (error) {
    console.error('Set webhook error:', error);
    res.status(500).json({ error: 'Failed to set webhook' });
  }
});

module.exports = router;