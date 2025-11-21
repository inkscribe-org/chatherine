// Chat functionality
let chatOpen = true;

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
        <div class="bg-blue-600 text-white p-3 max-w-[80%] message border border-blue-600">
            <p class="text-sm">${message}</p>
        </div>
        <div class="w-8 h-8 bg-gray-300 rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user text-gray-600 text-xs"></i>
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
        <div class="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-white text-xs"></i>
        </div>
        <div class="bg-white p-3 typing-indicator border border-gray-200">
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
        <div class="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-white text-xs"></i>
        </div>
        <div class="bg-white p-3 max-w-[80%] message border border-gray-200 shadow-sm">
            <p class="text-sm text-gray-800 whitespace-pre-line">${response.text}</p>
            ${response.action ? `<p class="text-xs text-blue-600 mt-2 font-medium">✓ ${response.action}</p>` : ''}
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
            <p class="text-sm text-base-content">${action}</p>
            <p class="text-xs text-muted-foreground mt-1">Just now</p>
        </div>
    `;
    updatesFeed.insertBefore(newUpdate, updatesFeed.firstChild);
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
});