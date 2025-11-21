const express = require('express');
const { analytics, actionLogs, appointments, services } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get analytics overview
router.get('/overview', authMiddleware, (req, res) => {
  try {
    const businessAnalytics = analytics[req.user.id];
    const businessLogs = actionLogs[req.user.id] || [];
    const businessAppointments = appointments[req.user.id] || [];
    const businessServices = services[req.user.id] || [];

    if (!businessAnalytics) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }

    const overview = {
      inquiries: businessAnalytics.inquiries,
      popularServices: businessAnalytics.popularServices,
      metrics: businessAnalytics.metrics,
      summary: {
        totalInquiries: businessAnalytics.inquiries.total,
        totalAppointments: businessAppointments.length,
        totalServices: businessServices.length,
        totalActions: businessLogs.length,
        averageInquiriesPerDay: Math.round(businessAnalytics.inquiries.total / 7),
        conversionRate: Math.round((businessAppointments.length / businessAnalytics.inquiries.total) * 100)
      }
    };

    res.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// Get inquiry analytics
router.get('/inquiries', authMiddleware, (req, res) => {
  try {
    const businessAnalytics = analytics[req.user.id];

    if (!businessAnalytics) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }

    const { period = '7d' } = req.query;
    
    // Generate extended mock data based on period
    let dailyData = businessAnalytics.inquiries.daily;
    
    if (period === '30d') {
      // Generate 30 days of mock data
      dailyData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 20) + 10
        });
      }
    }

    const inquiryData = {
      daily: dailyData,
      total: dailyData.reduce((sum, day) => sum + day.count, 0),
      average: Math.round(dailyData.reduce((sum, day) => sum + day.count, 0) / dailyData.length),
      peak: Math.max(...dailyData.map(day => day.count)),
      trend: 'increasing' // Would calculate actual trend
    };

    res.json(inquiryData);
  } catch (error) {
    console.error('Inquiries analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry analytics' });
  }
});

// Get service performance
router.get('/services', authMiddleware, (req, res) => {
  try {
    const businessAnalytics = analytics[req.user.id];
    const businessServices = services[req.user.id] || [];

    if (!businessAnalytics) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }

    const servicePerformance = businessAnalytics.popularServices.map(service => {
      const serviceDetails = businessServices.find(s => s.name === service.name);
      return {
        ...service,
        revenue: service.bookings * (serviceDetails?.price || 0),
        averageRating: 4.5 + Math.random() * 0.5, // Mock rating
        growth: Math.floor(Math.random() * 20) - 5 // Mock growth percentage
      };
    });

    res.json({
      services: servicePerformance,
      totalRevenue: servicePerformance.reduce((sum, service) => sum + service.revenue, 0),
      totalBookings: servicePerformance.reduce((sum, service) => sum + service.bookings, 0)
    });
  } catch (error) {
    console.error('Service performance error:', error);
    res.status(500).json({ error: 'Failed to fetch service performance' });
  }
});

// Get action logs
router.get('/actions', authMiddleware, (req, res) => {
  try {
    const businessLogs = actionLogs[req.user.id] || [];
    const { limit = 50, offset = 0, action, source } = req.query;

    let filteredLogs = businessLogs;

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    if (source) {
      filteredLogs = filteredLogs.filter(log => log.source === source);
    }

    const paginatedLogs = filteredLogs
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(log => ({
        id: log.id,
        action: log.action,
        description: log.description,
        timestamp: log.timestamp,
        source: log.source,
        details: log.details
      }));

    res.json({
      actions: paginatedLogs,
      total: filteredLogs.length,
      hasMore: parseInt(offset) + parseInt(limit) < filteredLogs.length,
      summary: {
        totalActions: businessLogs.length,
        bySource: {
          whatsapp: businessLogs.filter(log => log.source === 'whatsapp').length,
          dashboard: businessLogs.filter(log => log.source === 'dashboard').length,
          api: businessLogs.filter(log => log.source === 'api').length
        },
        byAction: {
          price_update: businessLogs.filter(log => log.action === 'price_update').length,
          hours_update: businessLogs.filter(log => log.action === 'hours_update').length,
          service_add: businessLogs.filter(log => log.action === 'service_add').length
        }
      }
    });
  } catch (error) {
    console.error('Action logs error:', error);
    res.status(500).json({ error: 'Failed to fetch action logs' });
  }
});

// Get metrics
router.get('/metrics', authMiddleware, (req, res) => {
  try {
    const businessAnalytics = analytics[req.user.id];
    const businessLogs = actionLogs[req.user.id] || [];

    if (!businessAnalytics) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }

    const metrics = {
      ...businessAnalytics.metrics,
      additional: {
        totalActions: businessLogs.length,
        actionsThisWeek: businessLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return logDate > weekAgo;
        }).length,
        averageResponseTime: '2.5 minutes', // Mock data
        customerSatisfaction: 94.2 // Mock data
      }
    };

    res.json(metrics);
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get time analytics
router.get('/time', authMiddleware, (req, res) => {
  try {
    const businessAnalytics = analytics[req.user.id];
    const businessAppointments = appointments[req.user.id] || [];

    if (!businessAnalytics) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }

    // Analyze peak hours and days
    const hourlyDistribution = [];
    for (let hour = 0; hour < 24; hour++) {
      hourlyDistribution.push({
        hour,
        appointments: Math.floor(Math.random() * 5) + 1, // Mock data
        inquiries: Math.floor(Math.random() * 10) + 2 // Mock data
      });
    }

    const dailyDistribution = [
      { day: 'Monday', appointments: 12, inquiries: 25 },
      { day: 'Tuesday', appointments: 15, inquiries: 30 },
      { day: 'Wednesday', appointments: 18, inquiries: 28 },
      { day: 'Thursday', appointments: 14, inquiries: 32 },
      { day: 'Friday', appointments: 20, inquiries: 35 },
      { day: 'Saturday', appointments: 25, inquiries: 40 },
      { day: 'Sunday', appointments: 8, inquiries: 15 }
    ];

    res.json({
      hourly: hourlyDistribution,
      daily: dailyDistribution,
      peakHours: hourlyDistribution
        .sort((a, b) => b.appointments - a.appointments)
        .slice(0, 3)
        .map(h => `${h.hour}:00`),
      peakDays: dailyDistribution
        .sort((a, b) => b.appointments - a.appointments)
        .slice(0, 3)
        .map(d => d.day)
    });
  } catch (error) {
    console.error('Time analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch time analytics' });
  }
});

module.exports = router;