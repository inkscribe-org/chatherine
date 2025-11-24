const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const router = express.Router();

// Initialize Telegram Bot
let telegramBot = null;
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
}

// Helper function for backend API calls with error handling
const callBackendAPI = async (endpoint, options = {}) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const url = `${backendUrl}${endpoint}`;
  
  const defaultOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  try {
    console.log(`🔗 Calling backend API: ${url}`);
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response format
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: expected JSON object');
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Backend API call failed: ${error.message}`);
    
    // Re-throw with more context
    throw new Error(`Backend API call to ${endpoint} failed: ${error.message}`);
  }
};

// Helper function for chat API calls
const callChatAPI = async (message, customerId) => {
  try {
    const data = await callBackendAPI('/api/chat', {
      body: JSON.stringify({ message, customer_id: customerId })
    });
    
    if (!data.response) {
      throw new Error('Chat API response missing "response" field');
    }
    
    return data.response;
  } catch (error) {
    console.error(`❌ Chat API call failed: ${error.message}`);
    throw error;
  }
};

// AI response processor (calls backend AI service with enhanced functionality)
const generateAIResponse = async (message, customerId) => {
  const lowerMessage = message.toLowerCase();
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  console.log(`🤖 Processing message: "${message}" for customer: ${customerId}`);

  // Clear chat command
  if (lowerMessage.includes('clear') && (lowerMessage.includes('chat') || lowerMessage.includes('conversation'))) {
    return `🧹 **Chat Cleared!**

I've reset our conversation. You can start fresh with any questions about your business.

What would you like to know or update today?`;
  }

  // Help command
  if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
    return `🤖 **Chatherine Bot Commands:**

💰 **Price Updates:**
• "Increase [service] from $[old] to $[new]"
• "Change [service] price to $[amount]"
• "Update [service] price to $[amount]"

⏰ **Hours Management:**
• "Close [day] for private event"
• "Open [day] from [time] to [time]"
• "Update [day] hours: [time] to [time]"
• "Set [day] as closed"

➕ **Service Management:**
• "Add [service] for $[price], [duration] minutes"
• "Add new service: [name] in [category]"
• "Remove [service] from menu"
• "List services" or "Show services"

📊 **Business Info:**
• "Show my schedule" or "List schedule"
• "Show appointments"
• "Show business hours"
• "Show inventory" or "Show stock"
• "Show revenue" or "Show sales"
• "Show policies" or "Show terms"
• "Show business facts" or "Business information"

🏢 **Business Management:**
• "Update business description: [description]"
• "Update business address: [address]"
• "Add staff member: [name] as [role]"
• "Set availability for [date]: [available/unavailable]"

📝 **Knowledge Base:**
• "Add business fact: [title] - [content]"
• "Search for [keyword]"
• "Store question: [question]"

🧹 **Chat Management:**
• "Clear chat" or "Clear conversation" - Start a new conversation

💡 **Smart Commands:**
• Just ask me anything about your business in natural language!
• "What are my business hours?"
• "How much revenue did I make today?"
• "Do I have any appointments?"
• "Tell me about my services"

Type any command and I'll update your business automatically!`;
  }

  // Enhanced command parsing for business operations
  
  // Business description updates
  if (lowerMessage.includes('update') && lowerMessage.includes('business') && lowerMessage.includes('description')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error updating business description:', error.message);
      return '📝 Error updating business description. Please try again later.';
    }
  }

  // Business location/address updates
  if ((lowerMessage.includes('update') || lowerMessage.includes('set')) && 
      (lowerMessage.includes('address') || lowerMessage.includes('location'))) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error updating business location:', error.message);
      return '📍 Error updating business location. Please try again later.';
    }
  }

  // Staff management
  if (lowerMessage.includes('add') && lowerMessage.includes('staff')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error adding staff member:', error.message);
      return '👥 Error adding staff member. Please try again later.';
    }
  }

  // Availability management
  if (lowerMessage.includes('availability') || 
      (lowerMessage.includes('set') && lowerMessage.includes('available'))) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error updating availability:', error.message);
      return '📅 Error updating availability. Please try again later.';
    }
  }

  // Business hours updates
  if (lowerMessage.includes('update') && lowerMessage.includes('hours')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error updating business hours:', error.message);
      return '🕒 Error updating business hours. Please try again later.';
    }
  }

  // Service price updates
  if ((lowerMessage.includes('update') || lowerMessage.includes('change')) && 
      lowerMessage.includes('price')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error updating service price:', error.message);
      return '💰 Error updating service price. Please try again later.';
    }
  }

  // Direct API calls for simple commands (fallback to AI for complex ones)
  
  // Show services
  if (lowerMessage.includes('show') && lowerMessage.includes('service')) {
    try {
      return await callChatAPI('Show my services', customerId);
    } catch (error) {
      console.error('Error fetching services:', error.message);
      return '📋 Error loading services. Please try again later.';
    }
  }

  // Show revenue
  if (lowerMessage.includes('revenue') || (lowerMessage.includes('show') && lowerMessage.includes('sales'))) {
    try {
      return await callChatAPI('Show my revenue for today', customerId);
    } catch (error) {
      console.error('Error fetching revenue:', error.message);
      return '💰 Error loading revenue data. Please try again later.';
    }
  }

  // Show appointments
  if (lowerMessage.includes('appointment')) {
    try {
      return await callChatAPI('Show my appointments', customerId);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      return '📅 Error loading appointments. Please try again later.';
    }
  }

  // Show inventory
  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    try {
      return await callChatAPI('Show my inventory', customerId);
    } catch (error) {
      console.error('Error fetching inventory:', error.message);
      return '📦 Error loading inventory. Please try again later.';
    }
  }

  // Show business hours
  if (lowerMessage.includes('hours') && lowerMessage.includes('show')) {
    try {
      return await callChatAPI('Show my business hours', customerId);
    } catch (error) {
      console.error('Error fetching business hours:', error.message);
      return '🕒 Error loading business hours. Please try again later.';
    }
  }

  // Show policies
  if (lowerMessage.includes('polic') || lowerMessage.includes('terms') || lowerMessage.includes('refund')) {
    try {
      return await callChatAPI('Show my business policies', customerId);
    } catch (error) {
      console.error('Error fetching policies:', error.message);
      return '📋 Error loading policies. Please try again later.';
    }
  }

  // Show business facts
  if (lowerMessage.includes('fact') || (lowerMessage.includes('business') && lowerMessage.includes('information'))) {
    try {
      return await callChatAPI('Show my business facts', customerId);
    } catch (error) {
      console.error('Error fetching business facts:', error.message);
      return '📋 Error loading business facts. Please try again later.';
    }
  }

  // Business services management
  if (lowerMessage.includes('business service') || lowerMessage.includes('service category')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error processing business services:', error.message);
      return '📋 Error processing business services. Please try again later.';
    }
  }

  // Search business services
  if (lowerMessage.includes('search') && (lowerMessage.includes('service') || lowerMessage.includes('offering'))) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error searching business services:', error.message);
      return '🔍 Error searching business services. Please try again later.';
    }
  }

  // Add business service
  if (lowerMessage.includes('add') && lowerMessage.includes('business') && lowerMessage.includes('service')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error adding business service:', error.message);
      return '➕ Error adding business service. Please try again later.';
    }
  }

  // Unanswered questions management
  if (lowerMessage.includes('unanswered') || lowerMessage.includes('pending question')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error processing unanswered questions:', error.message);
      return '📝 Error processing unanswered questions. Please try again later.';
    }
  }

  // Store unanswered question
  if (lowerMessage.includes('store') && lowerMessage.includes('question')) {
    try {
      return await callChatAPI(message, customerId);
    } catch (error) {
      console.error('Error storing question:', error.message);
      return '📝 Error storing question. Please try again later.';
    }
  }

  // Show schedule
  if ((lowerMessage.includes('schedule') || lowerMessage.includes('list schedule')) && !lowerMessage.includes('business')) {
    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Show my complete schedule', 
          customer_id: customerId 
        })
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return '📅 Error loading schedule.';
    }
  }

  // Default response - call backend AI for complex processing
  try {
    const response = await callChatAPI(message, customerId);
    console.log(`🤖 Backend AI response: "${response}"`);
    return response;
  } catch (error) {
    console.error('Error calling backend AI:', error.message);
    
    // Check if it's a network/connection error
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return `❌ **Connection Error**

I'm having trouble connecting to the backend service. Please try again later.

If this problem persists, please contact support.`;
    }
    
    // Check if it's an API error
    if (error.message.includes('API Error')) {
      return `❌ **Backend Error**

The backend service returned an error: ${error.message}

Please try again or contact support if the problem continues.`;
    }
    
    // Generic error with helpful suggestions
    return `🤔 I understand you want to: "${message}".

I'm having trouble processing that request right now. Here are some things you can try:

💡 **Try these commands:**
• "Show my services"
• "Show my schedule" 
• "Show business hours"
• "Show revenue today"
• "Help" - for all available commands

Or try rephrasing your request in a different way.`;
  }
};

// Telegram webhook endpoint
router.post('/', async (req, res) => {
  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const message = update.message.text;
    const userId = update.message.from.id.toString();

    console.log(`📱 Message received from ${chatId} (user ${userId}): "${message}"`);

    // Find customer by Telegram ID via backend
    let customer = null;
    try {
      const customerData = await callBackendAPI(`/api/customers/telegram/${userId}`, {
        method: 'GET'
      });
      
      // Check if it's not an error response
      if (customerData && !customerData.error) {
        customer = customerData;
      }
    } catch (error) {
      console.error('Error fetching customer:', error.message);
      // Continue with null customer - will show welcome message
    }

    if (!customer) {
      const welcomeMsg = `👋 Welcome to Chatherine!

I'm your AI business assistant. I can help you update your business information through simple text messages.

To get started, please register your business at our website, or type "help" to see what I can do.

🤖 Your business, updated by text.`;

      sendTelegramMessage(chatId, welcomeMsg);
      return res.status(200).send('OK');
    }

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await generateAIResponse(message, customer.id);
    } catch (error) {
      console.error('Error generating AI response:', error.message);
      aiResponse = `❌ **Processing Error**

I'm having trouble processing your request right now. This could be due to:

• Backend service being temporarily unavailable
• Network connectivity issues
• High system load

Please try again in a few moments. If the problem persists, contact support.

📞 **Need Help?**
Type "help" to see all available commands.`;
    }

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