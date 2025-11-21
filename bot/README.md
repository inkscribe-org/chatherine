# Chathy WhatsApp Bot

A comprehensive WhatsApp bot for business management with AI assistant capabilities. Chathy allows business owners to update their business information through natural language text messages.

## Features

### 🤖 Core Functionality
- **WhatsApp Integration**: Full Twilio-powered WhatsApp bot functionality
- **Natural Language Processing**: Understands business updates via text
- **Real-time Updates**: Instant business data modifications
- **Multi-channel Support**: WhatsApp, SMS, Website widget, Instagram DMs

### 📱 Business Management
- **Service Management**: Add, edit, and remove services/menu items
- **Pricing Updates**: Change prices through simple text commands
- **Schedule Management**: Update business hours and availability
- **Inventory Tracking**: Monitor stock levels and alerts
- **Appointment Booking**: Automated customer scheduling

### 📊 Analytics & Insights
- **Customer Inquiries**: Track customer interactions over time
- **Popular Services**: Identify best-performing offerings
- **Conversion Metrics**: Monitor booking conversion rates
- **Time Savings**: Measure efficiency improvements
- **Action Logs**: Complete audit trail of all changes

### 🎛️ AI Configuration
- **Tone Settings**: Friendly, formal, concise, or detailed responses
- **Action Permissions**: Control what AI can do automatically
- **Channel Management**: Enable/disable communication channels
- **Response Preview**: Test AI responses before deployment

### 🔧 Settings & Integrations
- **Business Profile**: Complete business information management
- **Security Settings**: 2FA, session management, API keys
- **Third-party Integrations**: Calendar, CRM, Payment systems
- **Notification Preferences**: Customizable alert system

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Twilio account (for WhatsApp)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chathy/bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Access the application**
   - Web Interface: http://localhost:3000
   - API Health Check: http://localhost:3000/health
   - WhatsApp Webhook: http://localhost:3000/webhook/whatsapp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `POST /api/auth/onboarding/complete` - Complete onboarding

### Business Management
- `GET /api/business/profile` - Get business profile
- `PUT /api/business/profile` - Update business profile
- `GET /api/business/hours` - Get business hours
- `PUT /api/business/hours` - Update business hours
- `GET /api/business/services` - Get services
- `POST /api/business/services` - Add service
- `PUT /api/business/services/:id` - Update service
- `DELETE /api/business/services/:id` - Delete service

### WhatsApp Integration
- `POST /api/whatsapp/webhook` - WhatsApp webhook endpoint
- `POST /api/whatsapp/send` - Send WhatsApp message
- `GET /api/whatsapp/history` - Get message history

### Dashboard
- `GET /api/dashboard/` - Get dashboard data
- `GET /api/dashboard/updates` - Get recent updates
- `GET /api/dashboard/snapshot` - Get business snapshot
- `GET /api/dashboard/alerts` - Get alerts

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/inquiries` - Get inquiry analytics
- `GET /api/analytics/services` - Get service performance
- `GET /api/analytics/actions` - Get action logs
- `GET /api/analytics/metrics` - Get metrics
- `GET /api/analytics/time` - Get time analytics

### Settings
- `GET /api/settings/ai` - Get AI settings
- `PUT /api/settings/ai` - Update AI settings
- `GET /api/settings/channels` - Get channel settings
- `PUT /api/settings/channels/:channel/toggle` - Toggle channel
- `GET /api/settings/profile` - Get profile settings
- `GET /api/settings/notifications` - Get notification settings
- `GET /api/settings/security` - Get security settings
- `GET /api/settings/integrations` - Get integrations

## WhatsApp Commands

### Price Updates
```
"Increase full facial from $100 to $120"
"Change massage price to $80"
"Update haircut cost to $45"
```

### Hours Management
```
"Close early on Friday"
"Open Sundays from 10am to 4pm"
"Update Monday hours: 9am to 7pm"
```

### Service Management
```
"Add deep tissue massage for $120, 60 minutes"
"Remove old service from menu"
"Update pedicure duration to 45 minutes"
```

### General Updates
```
"We're closed for private event on Saturday"
"New phone number: 555-0123"
"Updated address: 123 Main St"
```

## Web Interface

The application includes a comprehensive web interface with the following screens:

### 1. Onboarding Flow
- Welcome screen with sign in/create account options
- Account creation with business information
- Business setup with hours and services
- Integration configuration

### 2. Dashboard
- Business snapshot with today's overview
- Recent updates feed showing AI actions
- Quick action buttons for common tasks
- Alerts and notifications

### 3. Messaging Interface
- Real-time chat interface with Chathy
- Message history and synchronization
- Natural language input for business updates
- AI response preview

### 4. Business Data Management
- Hours & schedule management
- Services and menu items
- Inventory tracking
- Business policies and rules

### 5. AI Settings
- Tone and behavior configuration
- Channel management
- Permission settings
- Response testing

### 6. Analytics & Insights
- Customer inquiry trends
- Service performance metrics
- Action logs and audit trail
- Time savings and efficiency metrics

### 7. Settings & Profile
- Business profile management
- Security settings
- Integration management
- Notification preferences

## Mock Data

The application includes comprehensive mock data for:
- User accounts and business profiles
- Services and pricing
- Appointments and schedules
- Inventory items
- Analytics and metrics
- Action logs and history

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Development

### Project Structure
```
├── data/           # Mock data
├── middleware/     # Express middleware
├── models/         # Data models
├── public/         # Frontend assets
├── routes/         # API routes
├── utils/          # Utility functions
├── server.js       # Main server file
└── package.json    # Dependencies
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Email: support@chathy.com
- Documentation: https://docs.chathy.com

---

**Chathy** - Your business, updated by text. 🤖✨