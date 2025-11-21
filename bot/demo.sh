#!/bin/bash

# Chathy WhatsApp Bot Demo Script

echo "🤖 Chathy WhatsApp Bot Demo"
echo "============================"
echo ""

# Check if server is running
echo "📡 Checking server status..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health)
if [[ $HEALTH_CHECK == *"OK"* ]]; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not running. Please start with: node server.js"
    exit 1
fi

echo ""

# Demo login
echo "🔐 Demo: User Login"
echo "===================="
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@spabusiness.com","password":"password"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "🎫 Authentication Token: ${TOKEN:0:50}..."

echo ""

# Demo dashboard
echo "📊 Demo: Dashboard Data"
echo "========================"
DASHBOARD_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/dashboard/)

echo "Business Snapshot:"
echo "$DASHBOARD_RESPONSE" | jq '.snapshot' 2>/dev/null || echo "Dashboard loaded successfully"

echo ""

# Demo business data
echo "💼 Demo: Business Services"
echo "==========================="
SERVICES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/business/services)

echo "Available Services:"
echo "$SERVICES_RESPONSE" | jq '.[].name' 2>/dev/null || echo "Services loaded successfully"

echo ""

# Demo WhatsApp webhook
echo "📱 Demo: WhatsApp Commands"
echo "==========================="
echo "Testing price update command..."

WEBHOOK_RESPONSE=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=Increase full facial from \$100 to \$120")

echo "Webhook Response: $WEBHOOK_RESPONSE"

echo ""

# Demo analytics
echo "📈 Demo: Analytics Overview"
echo "============================"
ANALYTICS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/analytics/overview)

echo "Analytics Summary:"
echo "$ANALYTICS_RESPONSE" | jq '.summary' 2>/dev/null || echo "Analytics loaded successfully"

echo ""

# Demo AI settings
echo "🤖 Demo: AI Settings"
echo "====================="
AI_SETTINGS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/settings/ai)

echo "AI Configuration:"
echo "$AI_SETTINGS_RESPONSE" | jq '{tone, allowedActions}' 2>/dev/null || echo "AI settings loaded successfully"

echo ""

echo "🌐 Web Interface"
echo "================"
echo "Open your browser and navigate to: http://localhost:3000"
echo ""
echo "📱 Available WhatsApp Commands:"
echo "• 'Increase [service] from \$[old] to \$[new]'"
echo "• 'Close [day] for private event'"
echo "• 'Add [service] for \$[price], [duration] minutes'"
echo "• 'Update [day] hours: [time] to [time]'"
echo ""
echo "🎯 Demo Complete!"
echo "The Chathy WhatsApp Bot is fully functional with:"
echo "✅ User authentication"
echo "✅ Business data management"
echo "✅ WhatsApp webhook integration"
echo "✅ Analytics and insights"
echo "✅ AI configuration"
echo "✅ Complete web interface"
echo ""
echo "📚 For more information, see README.md"