const express = require('express');
const { aiSettings, businesses } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get AI settings
router.get('/ai', authMiddleware, (req, res) => {
  try {
    const settings = aiSettings[req.user.id];
    
    if (!settings) {
      // Create default settings if not found
      const defaultSettings = {
        tone: 'friendly',
        allowedActions: {
          canBook: true,
          canCancel: true,
          canTakePayments: false,
          canRecommend: true
        },
        channels: {
          website: { enabled: true, lastInteraction: null },
          sms: { enabled: true, lastInteraction: null },
          instagram: { enabled: false, lastInteraction: null },
          google: { enabled: false, lastInteraction: null }
        }
      };
      aiSettings[req.user.id] = defaultSettings;
      return res.json(defaultSettings);
    }

    res.json(settings);
  } catch (error) {
    console.error('Get AI settings error:', error);
    res.status(500).json({ error: 'Failed to fetch AI settings' });
  }
});

// Update AI settings
router.put('/ai', authMiddleware, (req, res) => {
  try {
    const currentSettings = aiSettings[req.user.id] || {};
    const updatedSettings = { ...currentSettings, ...req.body };
    
    aiSettings[req.user.id] = updatedSettings;

    res.json({
      message: 'AI settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Update AI settings error:', error);
    res.status(500).json({ error: 'Failed to update AI settings' });
  }
});

// Update AI tone
router.put('/ai/tone', authMiddleware, (req, res) => {
  try {
    const { tone } = req.body;
    
    if (!['friendly', 'formal', 'concise', 'detailed'].includes(tone)) {
      return res.status(400).json({ error: 'Invalid tone. Must be: friendly, formal, concise, or detailed' });
    }

    if (!aiSettings[req.user.id]) {
      aiSettings[req.user.id] = {};
    }
    
    aiSettings[req.user.id].tone = tone;

    res.json({
      message: 'AI tone updated successfully',
      tone
    });
  } catch (error) {
    console.error('Update AI tone error:', error);
    res.status(500).json({ error: 'Failed to update AI tone' });
  }
});

// Update allowed actions
router.put('/ai/actions', authMiddleware, (req, res) => {
  try {
    const { allowedActions } = req.body;
    
    if (!aiSettings[req.user.id]) {
      aiSettings[req.user.id] = {};
    }
    
    aiSettings[req.user.id].allowedActions = allowedActions;

    res.json({
      message: 'AI allowed actions updated successfully',
      allowedActions
    });
  } catch (error) {
    console.error('Update allowed actions error:', error);
    res.status(500).json({ error: 'Failed to update allowed actions' });
  }
});

// Update channel settings
router.put('/ai/channels', authMiddleware, (req, res) => {
  try {
    const { channels } = req.body;
    
    if (!aiSettings[req.user.id]) {
      aiSettings[req.user.id] = {};
    }
    
    aiSettings[req.user.id].channels = channels;

    res.json({
      message: 'Channel settings updated successfully',
      channels
    });
  } catch (error) {
    console.error('Update channel settings error:', error);
    res.status(500).json({ error: 'Failed to update channel settings' });
  }
});

// Get channel status
router.get('/channels', authMiddleware, (req, res) => {
  try {
    const settings = aiSettings[req.user.id];
    const business = businesses[req.user.id];
    
    if (!settings) {
      return res.status(404).json({ error: 'AI settings not found' });
    }

    const channels = Object.entries(settings.channels).map(([channel, config]) => ({
      name: channel,
      displayName: channel.charAt(0).toUpperCase() + channel.slice(1),
      enabled: config.enabled,
      lastInteraction: config.lastInteraction,
      status: config.enabled ? 'active' : 'inactive',
      connected: config.enabled, // In real app, check actual connection status
      webhookUrl: config.enabled ? `https://your-domain.com/webhook/${channel}` : null
    }));

    res.json(channels);
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ error: 'Failed to fetch channel status' });
  }
});

// Toggle channel
router.put('/channels/:channel/toggle', authMiddleware, (req, res) => {
  try {
    const { channel } = req.params;
    const { enabled } = req.body;
    
    if (!aiSettings[req.user.id]) {
      aiSettings[req.user.id] = { channels: {} };
    }
    
    if (!aiSettings[req.user.id].channels[channel]) {
      aiSettings[req.user.id].channels[channel] = {};
    }
    
    aiSettings[req.user.id].channels[channel].enabled = enabled;
    
    if (enabled) {
      aiSettings[req.user.id].channels[channel].lastInteraction = new Date().toISOString();
    }

    res.json({
      message: `${channel} channel ${enabled ? 'enabled' : 'disabled'} successfully`,
      channel,
      enabled
    });
  } catch (error) {
    console.error('Toggle channel error:', error);
    res.status(500).json({ error: 'Failed to toggle channel' });
  }
});

// Get business profile settings
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    
    if (!business) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Get profile settings error:', error);
    res.status(500).json({ error: 'Failed to fetch profile settings' });
  }
});

// Update business profile
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    
    if (!business) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    const updatedProfile = { ...business, ...req.body, updatedAt: new Date().toISOString() };
    businesses[req.user.id] = updatedProfile;

    res.json({
      message: 'Business profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile settings error:', error);
    res.status(500).json({ error: 'Failed to update profile settings' });
  }
});

// Get notification settings
router.get('/notifications', authMiddleware, (req, res) => {
  try {
    // Mock notification settings
    const notificationSettings = {
      email: {
        enabled: true,
        appointments: true,
        inquiries: true,
        updates: false,
        marketing: false
      },
      sms: {
        enabled: true,
        appointments: true,
        inquiries: true,
        updates: true,
        marketing: false
      },
      push: {
        enabled: false,
        appointments: true,
        inquiries: true,
        updates: true,
        marketing: false
      }
    };

    res.json(notificationSettings);
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

// Update notification settings
router.put('/notifications', authMiddleware, (req, res) => {
  try {
    const { channel, settings } = req.body;
    
    // In a real app, save to database
    console.log(`Updating ${channel} notifications:`, settings);

    res.json({
      message: 'Notification settings updated successfully',
      channel,
      settings
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Get security settings
router.get('/security', authMiddleware, (req, res) => {
  try {
    // Mock security settings
    const securitySettings = {
      twoFactorAuth: {
        enabled: false,
        method: 'sms' // sms, email, app
      },
      sessionTimeout: 24, // hours
      apiKeys: [
        {
          id: 'key1',
          name: 'Mobile App',
          lastUsed: '2024-03-24T10:30:00Z',
          permissions: ['read', 'write']
        }
      ],
      loginHistory: [
        {
          timestamp: '2024-03-25T09:15:00Z',
          ip: '192.168.1.100',
          device: 'Chrome on Windows',
          location: 'New York, USA'
        }
      ]
    };

    res.json(securitySettings);
  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({ error: 'Failed to fetch security settings' });
  }
});

// Get integrations
router.get('/integrations', authMiddleware, (req, res) => {
  try {
    // Mock integrations
    const integrations = [
      {
        id: 'calendar',
        name: 'Google Calendar',
        description: 'Sync appointments with Google Calendar',
        connected: true,
        lastSync: '2024-03-25T08:00:00Z',
        settings: {
          syncDirection: 'bidirectional',
          autoAccept: true
        }
      },
      {
        id: 'crm',
        name: 'Salesforce',
        description: 'Connect with Salesforce CRM',
        connected: false,
        lastSync: null,
        settings: {}
      },
      {
        id: 'payment',
        name: 'Stripe',
        description: 'Process payments through Stripe',
        connected: true,
        lastSync: '2024-03-24T15:30:00Z',
        settings: {
          autoCapture: true,
          webhooks: true
        }
      },
      {
        id: 'website',
        name: 'Website Widget',
        description: 'Add Chatherine to your website',
        connected: true,
        lastSync: null,
        settings: {
          position: 'bottom-right',
          theme: 'light'
        }
      }
    ];

    res.json(integrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

module.exports = router;