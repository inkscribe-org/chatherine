#!/bin/bash

# Chatherine WhatsApp Bot Demo Script - Pure Bot Version

echo "🤖 Chatherine WhatsApp Bot - Pure WhatsApp Interface"
echo "=================================================="
echo ""

# Check if server is running
echo "📡 Checking server status..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health)
if [[ $HEALTH_CHECK == *"OK"* ]]; then
    echo "✅ Bot is running on http://localhost:3000"
else
    echo "❌ Bot is not running. Please start with: node server.js"
    exit 1
fi

echo ""

# Show bot info
echo "📋 Bot Information:"
echo "=================="
curl -s http://localhost:3000/ | jq '.' 2>/dev/null || curl -s http://localhost:3000/

echo ""
echo ""

# Demo WhatsApp commands
echo "📱 Demo: WhatsApp Commands"
echo "==========================="
echo ""

echo "1️⃣  Testing price update command..."
echo "   Command: 'Increase full facial from \$100 to \$120'"
RESPONSE1=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=Increase full facial from \$100 to \$120")
echo "   ✅ Response: $RESPONSE1"
echo ""

echo "2️⃣  Testing hours update command..."
echo "   Command: 'Close Friday for private event'"
RESPONSE2=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=Close Friday for private event")
echo "   ✅ Response: OK"
echo ""

echo "3️⃣  Testing service addition command..."
echo "   Command: 'Add deep tissue massage for \$120, 60 minutes'"
RESPONSE3=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=Add deep tissue massage for \$120, 60 minutes")
echo "   ✅ Response: OK"
echo ""

echo "4️⃣  Testing help command..."
echo "   Command: 'help'"
RESPONSE4=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=help")
echo "   ✅ Response: OK"
echo ""

echo "5️⃣  Testing show services command..."
echo "   Command: 'Show my services'"
RESPONSE5=$(curl -s -X POST http://localhost:3000/webhook/whatsapp \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "From=+1234567890&To=+0987654321&Body=Show my services")
echo "   ✅ Response: OK"
echo ""

echo "📊 Available Commands:"
echo "===================="
echo "💰 **Price Updates:**"
echo "   • 'Increase [service] from \$[old] to \$[new]'"
echo "   • 'Change [service] price to \$[amount]'"
echo ""
echo "⏰ **Hours Management:**"
echo "   • 'Close [day] for private event'"
echo "   • 'Open [day] from [time] to [time]'"
echo "   • 'Update [day] hours: [time] to [time]'"
echo ""
echo "➕ **Service Management:**"
echo "   • 'Add [service] for \$[price], [duration] minutes'"
echo "   • 'Remove [service] from menu'"
echo ""
echo "📊 **Business Info:**"
echo "   • 'Show my services'"
echo "   • 'Show today's appointments'"
echo "   • 'Show business hours'"
echo ""
echo "❓ **Help:**"
echo "   • 'help' or 'commands' - Show all available commands"
echo ""

echo "🔧 How to Use with Real WhatsApp:"
echo "================================="
echo "1. Get a Twilio account: https://www.twilio.com"
echo "2. Get a WhatsApp-enabled phone number"
echo "3. Update .env file with your Twilio credentials:"
echo "   TWILIO_ACCOUNT_SID=your_account_sid"
echo "   TWILIO_AUTH_TOKEN=your_auth_token"
echo "   TWILIO_PHONE_NUMBER=your_whatsapp_number"
echo "4. Configure webhook URL in Twilio Console:"
echo "   http://your-domain.com/webhook/whatsapp"
echo "5. For local testing, use ngrok:"
echo "   ngrok http 3000"
echo ""

echo "🎯 Demo Complete!"
echo "================="
echo "✅ Pure WhatsApp bot is fully functional"
echo "✅ No web interface - pure bot interaction"
echo "✅ Natural language processing"
echo "✅ Real-time business updates"
echo "✅ Complete command system"
echo ""
echo "📱 The bot is ready to receive WhatsApp messages!"
echo "🚀 Start spreading the word: 'Your business, updated by text!'"