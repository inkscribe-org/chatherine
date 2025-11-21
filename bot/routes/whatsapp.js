const express = require('express');
const twilio = require('twilio');
const { services, businesses, actionLogs } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');

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
        
        return `Got it! Updated the service '${service.name}' from $${oldPrice} to $${newPrice}.`;
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
      
      return 'Updated Friday hours: Closed for private event.';
    }
  }
  
  // Service addition
  if (lowerMessage.includes('add') && (lowerMessage.includes('service') || lowerMessage.includes('menu'))) {
    const logEntry = {
      id: `log${Date.now()}`,
      action: 'service_add',
      description: `Added new service via text: ${message}`,
      timestamp: new Date().toISOString(),
      source: 'whatsapp',
      details: { message }
    };
    
    if (!actionLogs[businessId]) {
      actionLogs[businessId] = [];
    }
    actionLogs[businessId].unshift(logEntry);
    
    return `I understand you want to add a new service. I've noted this and will help you set it up properly.`;
  }
  
  // Default response
  return `I understand you want to: "${message}". I'm processing this and will update your business information accordingly. Is there anything specific you'd like me to help you with?`;
};

// WhatsApp webhook endpoint
router.post('/webhook', (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From; // Sender's phone number
  const to = req.body.To; // Your Twilio phone number

  console.log(`Received message from ${from}: ${incomingMsg}`);

  // Find user by phone number (in real app, query database)
  const { users } = require('../data/mockData');
  const user = users.find(u => u.phone === from);

  if (!user) {
    const response = 'Welcome to Chathy! Please sign up at our website to get started.';
    sendWhatsAppMessage(from, response);
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
      console.log('Mock WhatsApp message to', to, ':', message);
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

// Send message endpoint (for testing)
router.post('/send', authMiddleware, (req, res) => {
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

// Get message history
router.get('/history', authMiddleware, (req, res) => {
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
      message: 'Got it! Updated the service \'Full Facial Treatment\' from $100 to $120.',
      timestamp: '2024-03-24T10:31:00Z',
      to: '+1234567890'
    }
  ];

  res.json(mockHistory);
});

// Test endpoint for webhook
router.get('/test', (req, res) => {
  res.json({
    message: 'WhatsApp webhook is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;