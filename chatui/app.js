// Chat functionality
let chatOpen = true;

// Chat functionality

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

// Fake API responses
const fakeAPIResponses = {
    "hours": {
        text: "I've updated your business hours to 9:00 AM - 5:00 PM Monday through Thursday, and 9:00 AM - 4:00 PM on Saturday. Sunday remains closed.",
        action: "Updated business hours"
    },
    "price": {
        text: "I've updated the service pricing. The new rates are now reflected in your service menu and booking system.",
        action: "Updated service pricing"
    },
    "service": {
        text: "I've added the new service to your menu. It's now available for booking across all your channels.",
        action: "Added new service"
    },
    "closed": {
        text: "I've marked your business as closed for the specified date. Customers will be informed of your unavailability.",
        action: "Updated closure schedule"
    },
    "phone": {
        text: "I've updated your business phone number. This change is reflected on your website and in all customer communications.",
        action: "Updated phone number"
    },
    "default": {
        text: "I understand you want to make an update. Could you be more specific? You can ask me to:\n• Update hours ('Change my hours to 9-5')\n• Change prices ('Increase facial to $120')\n• Add services ('Add deep tissue massage for $150')\n• Mark closures ('Closed tomorrow for holiday')",
        action: "Requested clarification"
    }
};

function sendMessage() {
    console.log('sendMessage function called');
    
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    console.log('Message:', message);
    
    if (!message) {
        console.log('No message provided');
        return;
    }
    
    // Prevent sending duplicate messages while loading
    if (document.getElementById('loading-indicator')) {
        console.log('Loading indicator already exists');
        return;
    }
    
    const messagesContainer = document.getElementById('chat-messages');
    console.log('Messages container found:', messagesContainer);
    
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
    input.blur(); // Remove focus from input
    input.disabled = true; // Disable input during loading
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    console.log('User message added, now showing loading indicator');
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Simulate API call with loading - 5 seconds for realistic feel
    setTimeout(() => {
        console.log('Timeout reached, removing loading indicator');
        removeLoadingIndicator();
        input.disabled = false; // Re-enable input
        input.focus(); // Focus back on input
        const aiResponse = generateAIResponse(message);
        addAIMessage(aiResponse);
    }, 5000); // 5 second delay to simulate API call
}

function showLoadingIndicator() {
    console.log('showLoadingIndicator function called');
    
    const messagesContainer = document.getElementById('chat-messages');
    console.log('Messages container:', messagesContainer);
    
    if (!messagesContainer) {
        console.error('Messages container not found!');
        return;
    }
    
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.className = 'flex items-start space-x-3';
    loadingIndicator.innerHTML = `
        <div class="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-white text-xs"></i>
        </div>
        <div class="bg-white p-3 border border-gray-200 rounded-sm shadow-sm">
            <div class="flex items-center space-x-2">
                <div class="loading-spinner"></div>
                <span class="text-sm text-gray-600">Processing your request...</span>
            </div>
        </div>
    `;
    
    console.log('Loading indicator HTML created');
    messagesContainer.appendChild(loadingIndicator);
    console.log('Loading indicator appended to container');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Debug log
    console.log('Loading indicator added successfully');
    console.log('Loading indicator element:', document.getElementById('loading-indicator'));
}

function removeLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.remove();
        console.log('Loading indicator removed');
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Determine response type based on keywords
    let responseType = 'default';
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
        responseType = 'hours';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('$')) {
        responseType = 'price';
    } else if (lowerMessage.includes('add') || lowerMessage.includes('new service') || lowerMessage.includes('service')) {
        responseType = 'service';
    } else if (lowerMessage.includes('closed') || lowerMessage.includes('close') || lowerMessage.includes('unavailable')) {
        responseType = 'closed';
    } else if (lowerMessage.includes('phone') || lowerMessage.includes('number') || lowerMessage.includes('contact')) {
        responseType = 'phone';
    }
    
    return fakeAPIResponses[responseType] || fakeAPIResponses.default;
}

function addAIMessage(response) {
    const messagesContainer = document.getElementById('chat-messages');
    const aiMessage = document.createElement('div');
    aiMessage.className = 'flex items-start space-x-3 api-response';
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
}





// Test function for debugging loading indicator
function testLoading() {
    console.log('Test loading function called');
    showLoadingIndicator();
    
    setTimeout(() => {
        console.log('Test timeout reached');
        removeLoadingIndicator();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Add enter key support for chat
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Focus chat input on load
    document.getElementById('chat-input').focus();
});