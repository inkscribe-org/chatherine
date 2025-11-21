// Mock data for users
const users = [
  {
    id: '1',
    email: 'john@spabusiness.com',
    phone: '+1234567890',
    businessName: 'Serenity Spa',
    password: '$2a$10$example_hash', // hashed password
    businessType: 'spa',
    createdAt: '2024-01-15T10:00:00Z',
    isOnboarded: true
  },
  {
    id: '2',
    email: 'maria@restaurant.com',
    phone: '+0987654321',
    businessName: 'Bella Italia',
    password: '$2a$10$example_hash',
    businessType: 'restaurant',
    createdAt: '2024-02-20T14:30:00Z',
    isOnboarded: true
  }
];

// Mock business data
const businesses = {
  '1': {
    id: '1',
    name: 'Serenity Spa',
    type: 'spa',
    logo: 'https://example.com/logo1.png',
    phone: '+1234567890',
    email: 'info@serenityspa.com',
    website: 'https://serenityspa.com',
    address: '123 Wellness St, Relax City, RC 12345',
    description: 'Your premier destination for relaxation and rejuvenation',
    createdAt: '2024-01-15T10:00:00Z'
  },
  '2': {
    id: '2',
    name: 'Bella Italia',
    type: 'restaurant',
    logo: 'https://example.com/logo2.png',
    phone: '+0987654321',
    email: 'hello@bellaitalia.com',
    website: 'https://bellaitalia.com',
    address: '456 Pasta Ave, Flavor Town, FT 67890',
    description: 'Authentic Italian cuisine in the heart of the city',
    createdAt: '2024-02-20T14:30:00Z'
  }
};

// Mock business hours
const businessHours = {
  '1': {
    monday: { open: '09:00', close: '20:00', isClosed: false },
    tuesday: { open: '09:00', close: '20:00', isClosed: false },
    wednesday: { open: '09:00', close: '20:00', isClosed: false },
    thursday: { open: '09:00', close: '20:00', isClosed: false },
    friday: { open: '09:00', close: '21:00', isClosed: false },
    saturday: { open: '08:00', close: '18:00', isClosed: false },
    sunday: { open: '10:00', close: '16:00', isClosed: false }
  },
  '2': {
    monday: { open: '11:00', close: '22:00', isClosed: false },
    tuesday: { open: '11:00', close: '22:00', isClosed: false },
    wednesday: { open: '11:00', close: '22:00', isClosed: false },
    thursday: { open: '11:00', close: '22:00', isClosed: false },
    friday: { open: '11:00', close: '23:00', isClosed: false },
    saturday: { open: '10:00', close: '23:00', isClosed: false },
    sunday: { open: '12:00', close: '21:00', isClosed: false }
  }
};

// Mock services/menu items
const services = {
  '1': [
    {
      id: 's1',
      name: 'Full Facial Treatment',
      price: 120,
      duration: 60,
      description: 'Complete facial rejuvenation with premium products',
      category: 'facial',
      isActive: true
    },
    {
      id: 's2',
      name: 'Swedish Massage',
      price: 80,
      duration: 45,
      description: 'Relaxing full-body massage',
      category: 'massage',
      isActive: true
    },
    {
      id: 's3',
      name: 'Deep Tissue Massage',
      price: 100,
      duration: 60,
      description: 'Therapeutic deep tissue massage',
      category: 'massage',
      isActive: true
    }
  ],
  '2': [
    {
      id: 'm1',
      name: 'Margherita Pizza',
      price: 14.99,
      duration: 15,
      description: 'Classic pizza with fresh mozzarella and basil',
      category: 'pizza',
      isActive: true
    },
    {
      id: 'm2',
      name: 'Spaghetti Carbonara',
      price: 16.99,
      duration: 20,
      description: 'Traditional Roman pasta with eggs and pancetta',
      category: 'pasta',
      isActive: true
    },
    {
      id: 'm3',
      name: 'Tiramisu',
      price: 7.99,
      duration: 5,
      description: 'Classic Italian dessert',
      category: 'dessert',
      isActive: true
    }
  ]
};

// Mock appointments
const appointments = {
  '1': [
    {
      id: 'a1',
      customerId: 'c1',
      customerName: 'Sarah Johnson',
      customerPhone: '+1111111111',
      serviceId: 's1',
      serviceName: 'Full Facial Treatment',
      date: '2024-03-25',
      time: '14:00',
      duration: 60,
      status: 'confirmed',
      notes: 'First time client'
    },
    {
      id: 'a2',
      customerId: 'c2',
      customerName: 'Mike Davis',
      customerPhone: '+2222222222',
      serviceId: 's2',
      serviceName: 'Swedish Massage',
      date: '2024-03-25',
      time: '16:00',
      duration: 45,
      status: 'confirmed',
      notes: 'Prefers light pressure'
    }
  ],
  '2': [
    {
      id: 'r1',
      customerId: 'c3',
      customerName: 'Emily Chen',
      customerPhone: '+3333333333',
      serviceId: 'm1',
      serviceName: 'Margherita Pizza',
      date: '2024-03-25',
      time: '19:00',
      duration: 15,
      status: 'confirmed',
      notes: 'Table for 2, window seat preferred'
    }
  ]
};

// Mock inventory (for spa)
const inventory = {
  '1': [
    {
      id: 'i1',
      name: 'Facial Cream Premium',
      currentStock: 15,
      minStock: 5,
      unit: 'bottles',
      lastRestocked: '2024-03-20',
      supplier: 'Beauty Supplies Co'
    },
    {
      id: 'i2',
      name: 'Massage Oil Lavender',
      currentStock: 8,
      minStock: 3,
      unit: 'bottles',
      lastRestocked: '2024-03-18',
      supplier: 'Wellness Products Inc'
    }
  ],
  '2': [
    {
      id: 'f1',
      name: 'Mozzarella Cheese',
      currentStock: 25,
      minStock: 10,
      unit: 'kg',
      lastRestocked: '2024-03-24',
      supplier: 'Local Dairy Farm'
    },
    {
      id: 'f2',
      name: 'Fresh Basil',
      currentStock: 3,
      minStock: 2,
      unit: 'bunches',
      lastRestocked: '2024-03-25',
      supplier: 'Local Garden'
    }
  ]
};

// Mock business policies
const policies = {
  '1': {
    cancellation: {
      noticeHours: 24,
      feePercentage: 50,
      description: 'Cancellations must be made at least 24 hours in advance'
    },
    booking: {
      advanceDays: 30,
      depositRequired: true,
      depositAmount: 25,
      description: 'Bookings can be made up to 30 days in advance with 25% deposit'
    },
    payment: {
      methods: ['cash', 'card', 'online'],
      description: 'We accept cash, credit cards, and online payments'
    }
  },
  '2': {
    cancellation: {
      noticeHours: 2,
      feePercentage: 0,
      description: 'Cancellations can be made up to 2 hours before with no fee'
    },
    booking: {
      advanceDays: 7,
      depositRequired: false,
      depositAmount: 0,
      description: 'Reservations can be made up to 7 days in advance'
    },
    payment: {
      methods: ['cash', 'card'],
      description: 'We accept cash and credit cards'
    }
  }
};

// Mock action logs
const actionLogs = {
  '1': [
    {
      id: 'log1',
      action: 'price_update',
      description: 'Updated Full Facial Treatment from $100 to $120',
      timestamp: '2024-03-24T10:30:00Z',
      source: 'whatsapp',
      details: { oldPrice: 100, newPrice: 120, serviceId: 's1' }
    },
    {
      id: 'log2',
      action: 'hours_update',
      description: 'Updated Friday hours: Closed for private event',
      timestamp: '2024-03-23T15:45:00Z',
      source: 'whatsapp',
      details: { day: 'friday', isClosed: true }
    }
  ],
  '2': [
    {
      id: 'log3',
      action: 'service_add',
      description: 'Added new menu item: Tiramisu',
      timestamp: '2024-03-22T09:15:00Z',
      source: 'dashboard',
      details: { serviceName: 'Tiramisu', price: 7.99 }
    }
  ]
};

// Mock analytics data
const analytics = {
  '1': {
    inquiries: {
      daily: [
        { date: '2024-03-20', count: 12 },
        { date: '2024-03-21', count: 15 },
        { date: '2024-03-22', count: 18 },
        { date: '2024-03-23', count: 14 },
        { date: '2024-03-24', count: 20 }
      ],
      total: 79
    },
    popularServices: [
      { name: 'Full Facial Treatment', bookings: 45 },
      { name: 'Swedish Massage', bookings: 32 },
      { name: 'Deep Tissue Massage', bookings: 28 }
    ],
    metrics: {
      missedBookingsPrevented: 23,
      updateAccuracy: 94.5,
      timeSaved: 12.5 // hours
    }
  },
  '2': {
    inquiries: {
      daily: [
        { date: '2024-03-20', count: 25 },
        { date: '2024-03-21', count: 30 },
        { date: '2024-03-22', count: 28 },
        { date: '2024-03-23', count: 35 },
        { date: '2024-03-24', count: 32 }
      ],
      total: 150
    },
    popularServices: [
      { name: 'Margherita Pizza', orders: 89 },
      { name: 'Spaghetti Carbonara', orders: 67 },
      { name: 'Tiramisu', orders: 45 }
    ],
    metrics: {
      missedBookingsPrevented: 45,
      updateAccuracy: 96.2,
      timeSaved: 18.3
    }
  }
};

// Mock AI settings
const aiSettings = {
  '1': {
    tone: 'friendly',
    allowedActions: {
      canBook: true,
      canCancel: true,
      canTakePayments: false,
      canRecommend: true
    },
    channels: {
      website: { enabled: true, lastInteraction: '2024-03-24T18:30:00Z' },
      sms: { enabled: true, lastInteraction: '2024-03-25T09:15:00Z' },
      instagram: { enabled: false, lastInteraction: null },
      google: { enabled: true, lastInteraction: '2024-03-24T14:20:00Z' }
    }
  },
  '2': {
    tone: 'formal',
    allowedActions: {
      canBook: true,
      canCancel: true,
      canTakePayments: true,
      canRecommend: true
    },
    channels: {
      website: { enabled: true, lastInteraction: '2024-03-24T20:45:00Z' },
      sms: { enabled: true, lastInteraction: '2024-03-25T11:30:00Z' },
      instagram: { enabled: true, lastInteraction: '2024-03-24T16:10:00Z' },
      google: { enabled: false, lastInteraction: null }
    }
  }
};

module.exports = {
  users,
  businesses,
  businessHours,
  services,
  appointments,
  inventory,
  policies,
  actionLogs,
  analytics,
  aiSettings
};