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

// Restaurant-specific API responses
const restaurantResponses = {
    "reservation": {
        text: "I'd be happy to help you make a reservation! For tonight at 7 PM, I can book a table for 2 people. Would you like me to proceed with this reservation?",
        action: "Reservation request received"
    },
    "menu": {
        text: "Our most popular dishes include the Grilled Salmon with lemon butter sauce, Filet Mignon with red wine reduction, and our signature Truffle Mushroom Risotto. We also have excellent vegetarian options like the Eggplant Parmesan and Quinoa Stuffed Bell Peppers.",
        action: "Menu information provided"
    },
    "hours": {
        text: "We're open today from 11:00 AM to 10:00 PM. Our regular hours are:\nMonday-Thursday: 11 AM - 10 PM\nFriday-Saturday: 11 AM - 11 PM\nSunday: 12 PM - 9 PM",
        action: "Hours information provided"
    },
    "vegetarian": {
        text: "Yes! We have several delicious vegetarian options including our Eggplant Parmesan, Quinoa Stuffed Bell Peppers, Margherita Pizza, and a fresh Mediterranean Bowl. All can be prepared vegan upon request.",
        action: "Dietary information provided"
    },
    "location": {
        text: "We're located at 123 Gourmet Street, Downtown District. Free parking is available in the rear, and we're also accessible by public transit (Metro Line 2, Gourmet Station).",
        action: "Location information provided"
    },
    "default": {
        text: "Welcome to Bella Vista! I'm your AI dining concierge. I can help you with:\n• Making reservations ('Book a table for 2 at 7 PM')\n• Menu information ('What are your popular dishes?')\n• Hours and location ('When are you open?')\n• Dietary options ('Do you have vegetarian meals?')",
        action: "Restaurant assistance offered"
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
        <div class="bg-purple-600 text-white p-3 max-w-[80%] message border border-purple-600 rounded-lg">
            <p class="text-sm">${message}</p>
        </div>
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
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
    
    // Call backend API
    fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            customer_id: 6, // Bella Vista Restaurant customer ID
            api_key: 'YOUR_GOOGLE_API_KEY_HERE' // Replace with your actual Google Gemini API key
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
        removeLoadingIndicator();
        input.disabled = false;
        input.focus();
        addAIMessage({ text: data.response, action: 'AI Response' });
    })
    .catch(error => {
        console.error('Error calling backend:', error);
        removeLoadingIndicator();
        input.disabled = false;
        input.focus();
        addAIMessage({ text: 'Sorry, I encountered an error. Please try again.', action: 'Error' });
    });
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
        <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-concierge-bell text-white text-xs"></i>
        </div>
        <div class="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
            <div class="flex items-center space-x-2">
                <div class="loading-spinner"></div>
                <span class="text-sm text-gray-600">Finding the perfect table for you...</span>
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
    
    if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
        responseType = 'reservation';
    } else if (lowerMessage.includes('menu') || lowerMessage.includes('dish') || lowerMessage.includes('food') || lowerMessage.includes('popular')) {
        responseType = 'menu';
    } else if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close') || lowerMessage.includes('time')) {
        responseType = 'hours';
    } else if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan') || lowerMessage.includes('dietary') || lowerMessage.includes('gluten')) {
        responseType = 'vegetarian';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('direction')) {
        responseType = 'location';
    }
    
    return restaurantResponses[responseType] || restaurantResponses.default;
}

function addAIMessage(response) {
    const messagesContainer = document.getElementById('chat-messages');
    const aiMessage = document.createElement('div');
    aiMessage.className = 'flex items-start space-x-3 api-response';
    aiMessage.innerHTML = `
        <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-concierge-bell text-white text-xs"></i>
        </div>
        <div class="bg-white p-3 max-w-[80%] message border border-gray-200 shadow-sm rounded-lg">
            <p class="text-sm text-gray-800 whitespace-pre-line">${response.text}</p>
            ${response.action ? `<p class="text-xs text-purple-600 mt-2 font-medium">✓ ${response.action}</p>` : ''}
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

function setPresetMessage(message) {
    const input = document.getElementById('chat-input');
    input.value = message;
    input.focus();
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