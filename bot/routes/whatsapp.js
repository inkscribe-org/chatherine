const express = require('express');
const twilio = require('twilio');
const { services, businesses, actionLogs, users } = require('../data/mockData');

const router = express.Router();

// Initialize Twilio client (only if valid credentials are available)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
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
          source: 'whatsapp',
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
        source: 'whatsapp',
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
        source: 'whatsapp',
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

// WhatsApp webhook endpoint
router.post('/', (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From; // Sender's phone number
  const to = req.body.To; // Your Twilio phone number

  console.log(`📱 Message received from ${from}: "${incomingMsg}"`);

  // Find user by phone number (in real app, query database)
  const user = users.find(u => u.phone === from);

  if (!user) {
    const welcomeMsg = `👋 Welcome to Chathy!

I'm your AI business assistant. I can help you update your business information through simple text messages.

To get started, please register your business at our website, or type "help" to see what I can do.

🤖 Your business, updated by text.`;
    
    sendWhatsAppMessage(from, welcomeMsg);
    return res.status(200).send('<Response></Response>');
  }

  // Generate AI response
  const aiResponse = generateAIResponse(incomingMsg, user.id);

  // Send response back to user
  sendWhatsAppMessage(from, aiResponse);

  // Create TwiML response
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message({ to: from }, aiResponse);

  res.type('text/xml').send(twiml.toString());
});

// Send WhatsApp message
const sendWhatsAppMessage = (to, message) => {
  try {
    if (!twilioClient) {
      console.log(`📤 Mock WhatsApp message to ${to}:`);
      console.log(message);
      return;
    }
    
    twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

// Test endpoint for webhook
router.get('/test', (req, res) => {
  res.json({
    message: 'WhatsApp webhook is working',
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
      from: '+1234567890'
    },
    {
      id: '2',
      direction: 'outbound',
      message: '✅ Got it! Updated the service \'Full Facial Treatment\' from $100 to $120.',
      timestamp: '2024-03-24T10:31:00Z',
      to: '+1234567890'
    }
  ];

  res.json(mockHistory);
});

// Send message endpoint (for testing)
router.post('/send', (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    sendWhatsAppMessage(to, message);

    res.json({
      message: 'Message sent successfully',
      to,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;