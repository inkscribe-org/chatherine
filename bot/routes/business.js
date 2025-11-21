const express = require('express');
const { businesses, businessHours, services, appointments, inventory, policies } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get business profile
router.get('/profile', authMiddleware, (req, res) => {
  const business = businesses[req.user.id];
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(business);
});

// Update business profile
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const business = businesses[req.user.id];
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Update business data (in real app, save to database)
    const updatedBusiness = { ...business, ...req.body, updatedAt: new Date().toISOString() };
    businesses[req.user.id] = updatedBusiness;

    res.json({
      message: 'Business profile updated successfully',
      business: updatedBusiness
    });
  } catch (error) {
    console.error('Business profile update error:', error);
    res.status(500).json({ error: 'Failed to update business profile' });
  }
});

// Get business hours
router.get('/hours', authMiddleware, (req, res) => {
  const hours = businessHours[req.user.id];
  if (!hours) {
    return res.status(404).json({ error: 'Business hours not found' });
  }
  res.json(hours);
});

// Update business hours
router.put('/hours', authMiddleware, (req, res) => {
  try {
    const updatedHours = req.body;
    businessHours[req.user.id] = updatedHours;

    res.json({
      message: 'Business hours updated successfully',
      hours: updatedHours
    });
  } catch (error) {
    console.error('Business hours update error:', error);
    res.status(500).json({ error: 'Failed to update business hours' });
  }
});

// Get services/menu
router.get('/services', authMiddleware, (req, res) => {
  const businessServices = services[req.user.id] || [];
  res.json(businessServices);
});

// Add new service
router.post('/services', authMiddleware, (req, res) => {
  try {
    const newService = {
      id: `s${Date.now()}`,
      ...req.body,
      isActive: true
    };

    if (!services[req.user.id]) {
      services[req.user.id] = [];
    }
    services[req.user.id].push(newService);

    res.status(201).json({
      message: 'Service added successfully',
      service: newService
    });
  } catch (error) {
    console.error('Service addition error:', error);
    res.status(500).json({ error: 'Failed to add service' });
  }
});

// Update service
router.put('/services/:serviceId', authMiddleware, (req, res) => {
  try {
    const { serviceId } = req.params;
    const businessServices = services[req.user.id] || [];
    const serviceIndex = businessServices.findIndex(s => s.id === serviceId);

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    businessServices[serviceIndex] = { ...businessServices[serviceIndex], ...req.body };

    res.json({
      message: 'Service updated successfully',
      service: businessServices[serviceIndex]
    });
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/services/:serviceId', authMiddleware, (req, res) => {
  try {
    const { serviceId } = req.params;
    const businessServices = services[req.user.id] || [];
    const serviceIndex = businessServices.findIndex(s => s.id === serviceId);

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    businessServices.splice(serviceIndex, 1);

    res.json({
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get appointments
router.get('/appointments', authMiddleware, (req, res) => {
  const businessAppointments = appointments[req.user.id] || [];
  res.json(businessAppointments);
});

// Add appointment
router.post('/appointments', authMiddleware, (req, res) => {
  try {
    const newAppointment = {
      id: `a${Date.now()}`,
      ...req.body,
      status: 'confirmed'
    };

    if (!appointments[req.user.id]) {
      appointments[req.user.id] = [];
    }
    appointments[req.user.id].push(newAppointment);

    res.status(201).json({
      message: 'Appointment added successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Appointment addition error:', error);
    res.status(500).json({ error: 'Failed to add appointment' });
  }
});

// Get inventory
router.get('/inventory', authMiddleware, (req, res) => {
  const businessInventory = inventory[req.user.id] || [];
  res.json(businessInventory);
});

// Update inventory
router.put('/inventory/:itemId', authMiddleware, (req, res) => {
  try {
    const { itemId } = req.params;
    const businessInventory = inventory[req.user.id] || [];
    const itemIndex = businessInventory.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    businessInventory[itemIndex] = { ...businessInventory[itemIndex], ...req.body };

    res.json({
      message: 'Inventory updated successfully',
      item: businessInventory[itemIndex]
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Get policies
router.get('/policies', authMiddleware, (req, res) => {
  const businessPolicies = policies[req.user.id];
  if (!businessPolicies) {
    return res.status(404).json({ error: 'Policies not found' });
  }
  res.json(businessPolicies);
});

// Update policies
router.put('/policies', authMiddleware, (req, res) => {
  try {
    const updatedPolicies = req.body;
    policies[req.user.id] = updatedPolicies;

    res.json({
      message: 'Policies updated successfully',
      policies: updatedPolicies
    });
  } catch (error) {
    console.error('Policies update error:', error);
    res.status(500).json({ error: 'Failed to update policies' });
  }
});

module.exports = router;