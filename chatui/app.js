// Mock data for demonstration
const mockData = {
    business: {
        name: "Serenity Spa",
        type: "spa",
        hours: {
            monday: { open: "9:00 AM", close: "6:00 PM", closed: false },
            tuesday: { open: "9:00 AM", close: "6:00 PM", closed: false },
            wednesday: { open: "9:00 AM", close: "6:00 PM", closed: false },
            thursday: { open: "9:00 AM", close: "6:00 PM", closed: false },
            friday: { open: "9:00 AM", close: "6:00 PM", closed: true, reason: "Private Event" },
            saturday: { open: "9:00 AM", close: "4:00 PM", closed: false },
            sunday: { open: "9:00 AM", close: "4:00 PM", closed: true }
        },
        services: [
            { id: 1, name: "Massage Therapy", price: 120, duration: 60, description: "Full body relaxation" },
            { id: 2, name: "Full Facial", price: 120, duration: 90, description: "Complete facial treatment" },
            { id: 3, name: "Hair Styling", price: 80, duration: 45, description: "Cut and style" }
        ],
        appointments: [
            { id: 1, customer: "Sarah", service: "Massage Therapy", time: "10:00 AM", date: "Today" },
            { id: 2, customer: "Mike", service: "Full Facial", time: "11:30 AM", date: "Today" },
            { id: 3, customer: "Emma", service: "Hair Styling", time: "2:00 PM", date: "Today" }
        ]
    },
    updates: [
        { id: 1, type: "hours", message: "Updated Friday hours: Closed for private event", time: "2 hours ago", icon: "clock", color: "blue" },
        { id: 2, type: "price", message: "Updated service 'Full Facial' to $120", time: "5 hours ago", icon: "dollar-sign", color: "green" },
        { id: 3, type: "appointment", message: "Added new appointment: Sarah - Massage Therapy", time: "Yesterday", icon: "calendar", color: "purple" }
    ]
};

// Screen navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Chat functionality
let chatOpen = true;

function toggleChat() {
    const chatInterface = document.getElementById('chat-interface');
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatInterface.classList.remove('hidden');
        document.getElementById('chat-input').focus();
    } else {
        chatInterface.classList.add('hidden');
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chat-messages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'flex items-start space-x-3 justify-end';
    userMessage.innerHTML = `
        <div class="bg-primary text-primary-content p-3 max-w-[80%] message border-2 border-primary">
            <p class="text-sm">${message}</p>
        </div>
        <div class="w-8 h-8 bg-base-200 rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user text-base-content text-xs"></i>
        </div>
    `;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator();
        const aiResponse = generateAIResponse(message);
        addAIMessage(aiResponse);
    }, 1500);
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'flex items-start space-x-3';
    typingIndicator.innerHTML = `
        <div class="w-8 h-8 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-primary-content text-xs"></i>
        </div>
        <div class="bg-base-200 p-3 typing-indicator border-2 border-base-300">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Price update
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('$')) {
        if (lowerMessage.includes('facial')) {
            return {
                text: "Got it! I've updated the Full Facial service to $120. This change is now live across all your booking channels.",
                action: "Updated service 'Full Facial' to $120"
            };
        }
        if (lowerMessage.includes('massage')) {
            return {
                text: "I've updated the Massage Therapy price. The new rate is now reflected in your service menu.",
                action: "Updated Massage Therapy pricing"
            };
        }
    }
    
    // Hours update
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
        if (lowerMessage.includes('9-5') || lowerMessage.includes('9 to 5')) {
            return {
                text: "Perfect! I've updated your business hours to 9:00 AM - 5:00 PM Monday through Thursday, and 9:00 AM - 4:00 PM on Saturday. Sunday remains closed.",
                action: "Updated business hours to 9AM-5PM"
            };
        }
        if (lowerMessage.includes('closed tomorrow') || lowerMessage.includes('closed tmrw')) {
            return {
                text: "I've marked tomorrow as closed. Customers will be informed that you're unavailable for bookings.",
                action: "Marked tomorrow as closed"
            };
        }
    }
    
    // Service addition
    if (lowerMessage.includes('add') || lowerMessage.includes('new service')) {
        return {
            text: "I can help you add a new service! Please provide the service name, price, and duration. For example: 'Deep Tissue Massage, $150, 75 minutes'",
            action: "Ready to add new service"
        };
    }
    
    // Phone number update
    if (lowerMessage.includes('phone') || lowerMessage.includes('number')) {
        return {
            text: "I've updated your business phone number. This will be reflected on your website and in all customer communications.",
            action: "Updated business phone number"
        };
    }
    
    // Default response
    return {
        text: "I understand you want to make an update. Could you be more specific? You can ask me to:\n• Update hours ('Change my hours to 9-5')\n• Change prices ('Increase facial to $120')\n• Add services ('Add deep tissue massage for $150')\n• Mark closures ('Closed tomorrow for holiday')",
        action: "Requested clarification"
    };
}

function addAIMessage(response) {
    const messagesContainer = document.getElementById('chat-messages');
    const aiMessage = document.createElement('div');
    aiMessage.className = 'flex items-start space-x-3';
    aiMessage.innerHTML = `
        <div class="w-8 h-8 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-primary-content text-xs"></i>
        </div>
        <div class="bg-base-200 p-3 max-w-[80%] message border-2 border-base-300">
            <p class="text-sm text-card-foreground whitespace-pre-line">${response.text}</p>
            ${response.action ? `<p class="text-xs text-primary mt-2 font-medium">✓ ${response.action}</p>` : ''}
        </div>
    `;
    messagesContainer.appendChild(aiMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to updates feed if there was an action
    if (response.action) {
        addUpdateToFeed(response.action);
    }
}

function addUpdateToFeed(action) {
    const updatesFeed = document.getElementById('updates-feed');
    const newUpdate = document.createElement('div');
    newUpdate.className = 'flex items-start space-x-3 p-3 bg-success/10 border-l-4 border-success message';
    newUpdate.innerHTML = `
        <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-success rounded-sm flex items-center justify-center">
                <i class="fas fa-check text-success-content text-xs"></i>
            </div>
        </div>
        <div class="flex-1">
            <p class="text-sm text-card-foreground">${action}</p>
            <p class="text-xs text-muted-foreground mt-1">Just now</p>
        </div>
    `;
    updatesFeed.insertBefore(newUpdate, updatesFeed.firstChild);
}

// Business data tabs
function showBusinessDataTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('[id$="-tab"]').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    
    // Update navigation styling
    document.querySelectorAll('#business-data-screen nav button').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-600', 'font-medium');
        btn.classList.add('text-gray-700');
    });
    
    event.target.classList.remove('text-gray-700');
    event.target.classList.add('bg-blue-50', 'text-blue-600', 'font-medium');
}

// Form handlers
function handleBusinessSetup(event) {
    event.preventDefault();
    showScreen('dashboard-screen');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for chat
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Focus chat input on load
    document.getElementById('chat-input').focus();
    
    // Simulate real-time updates
    setInterval(() => {
        if (Math.random() > 0.8) {
            const randomUpdates = [
                "New customer inquiry received",
                "Appointment reminder sent",
                "Service availability updated",
                "Customer feedback collected"
            ];
            const randomUpdate = randomUpdates[Math.floor(Math.random() * randomUpdates.length)];
            console.log("Background update:", randomUpdate);
        }
    }, 30000); // Every 30 seconds
});

// Mobile responsiveness
function checkMobileView() {
    const chatInterface = document.getElementById('chat-interface');
    if (window.innerWidth < 768) {
        chatInterface.classList.remove('w-96');
        chatInterface.classList.add('w-full', 'h-full', 'bottom-0', 'right-0', 'rounded-none');
    } else {
        chatInterface.classList.add('w-96');
        chatInterface.classList.remove('w-full', 'h-full', 'bottom-0', 'right-0', 'rounded-none');
    }
}

window.addEventListener('resize', checkMobileView);
checkMobileView();