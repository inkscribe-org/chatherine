const express = require('express');
const { businesses, appointments, services, actionLogs } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get dashboard data
router.get('/', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    const businessAppointments = appointments[req.user.id] || [];
    const businessServices = services[req.user.id] || [];
    const businessLogs = actionLogs[req.user.id] || [];

    // Business snapshot
    const today = moment().format('YYYY-MM-DD');
    const todayAppointments = businessAppointments.filter(apt => 
      apt.date === today && apt.status === 'confirmed'
    );

    const nextAppointments = businessAppointments
      .filter(apt => apt.status === 'confirmed')
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
      .slice(0, 5);

    const topServices = businessServices
      .filter(service => service.isActive)
      .slice(0, 3);

    // Recent updates feed
    const recentUpdates = businessLogs
      .slice(0, 10)
      .map(log => ({
        id: log.id,
        action: log.action,
        description: log.description,
        timestamp: log.timestamp,
        source: log.source
      }));

    // Alerts
    const alerts = [];
    
    // Check for low inventory (simplified)
    if (business.type === 'spa') {
      alerts.push({
        id: 'alert1',
        type: 'inventory',
        message: 'Facial Cream Premium running low (15 bottles remaining)',
        severity: 'warning'
      });
    }

    // Check for conflicting rules
    if (business.type === 'restaurant') {
      alerts.push({
        id: 'alert2',
        type: 'schedule',
        message: 'Double booking detected for 7:00 PM tonight',
        severity: 'error'
      });
    }

    const dashboardData = {
      business: {
        name: business.name,
        type: business.type,
        phone: business.phone
      },
      snapshot: {
        todayHours: '9:00 AM - 8:00 PM', // Would come from businessHours
        todayAppointments: todayAppointments.length,
        nextAppointments,
        topServices,
        alerts
      },
      recentUpdates,
      stats: {
        totalAppointments: businessAppointments.length,
        totalServices: businessServices.length,
        totalUpdates: businessLogs.length
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get recent updates
router.get('/updates', authMiddleware, (req, res) => {
  try {
    const businessLogs = actionLogs[req.user.id] || [];
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const updates = businessLogs
      .slice(offset, offset + limit)
      .map(log => ({
        id: log.id,
        action: log.action,
        description: log.description,
        timestamp: log.timestamp,
        source: log.source,
        details: log.details
      }));

    res.json({
      updates,
      total: businessLogs.length,
      hasMore: offset + limit < businessLogs.length
    });
  } catch (error) {
    console.error('Updates error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// Get business snapshot
router.get('/snapshot', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    const businessAppointments = appointments[req.user.id] || [];
    const businessServices = services[req.user.id] || [];

    const today = moment().format('YYYY-MM-DD');
    const todayAppointments = businessAppointments.filter(apt => 
      apt.date === today && apt.status === 'confirmed'
    );

    const nextAppointments = businessAppointments
      .filter(apt => apt.status === 'confirmed')
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
      .slice(0, 5);

    const topServices = businessServices
      .filter(service => service.isActive)
      .slice(0, 3);

    const snapshot = {
      business: {
        name: business.name,
        type: business.type
      },
      today: {
        date: today,
        appointments: todayAppointments.length,
        hours: '9:00 AM - 8:00 PM' // Would come from businessHours
      },
      upcoming: nextAppointments,
      services: topServices
    };

    res.json(snapshot);
  } catch (error) {
    console.error('Snapshot error:', error);
    res.status(500).json({ error: 'Failed to fetch business snapshot' });
  }
});

// Get alerts
router.get('/alerts', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    const alerts = [];

    // Generate mock alerts based on business type
    if (business.type === 'spa') {
      alerts.push({
        id: 'alert1',
        type: 'inventory',
        message: 'Facial Cream Premium running low (15 bottles remaining)',
        severity: 'warning',
        timestamp: new Date().toISOString()
      });
      
      alerts.push({
        id: 'alert2',
        type: 'appointment',
        message: '3 appointments pending confirmation',
        severity: 'info',
        timestamp: new Date().toISOString()
      });
    }

    if (business.type === 'restaurant') {
      alerts.push({
        id: 'alert3',
        type: 'schedule',
        message: 'Fully booked for tonight',
        severity: 'success',
        timestamp: new Date().toISOString()
      });
    }

    res.json(alerts);
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;