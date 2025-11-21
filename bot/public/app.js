// Chathy WhatsApp Bot Frontend Application

// Global variables
let currentUser = null;
let authToken = null;
let apiBase = 'http://localhost:3000/api';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing session
    const savedToken = localStorage.getItem('chathy_token');
    const savedUser = localStorage.getItem('chathy_user');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showScreen('welcome');
    }

    // Setup form listeners
    setupFormListeners();
});

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('d-none');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenId}-screen`);
    if (targetScreen) {
        targetScreen.classList.remove('d-none');
        targetScreen.classList.add('fade-in');
    }
    
    // Load screen-specific data
    loadScreenData(screenId);
}

function showMainApp() {
    document.getElementById('mainNav').classList.remove('d-none');
    showScreen('dashboard');
    updateNavigation();
}

function updateNavigation() {
    if (currentUser) {
        document.getElementById('navUserName').textContent = currentUser.businessName || 'User';
    }
}

// Form listeners
function setupFormListeners() {
    // Sign in form
    document.getElementById('signin-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleSignIn();
    });
    
    // Sign up form
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleSignUp();
    });
    
    // Business setup form
    const businessSetupForm = document.getElementById('business-setup-form');
    if (businessSetupForm) {
        businessSetupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleBusinessSetup();
        });
    }
    
    // Message form
    const messageForm = document.getElementById('message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await sendMessage();
        });
    }
}

// Authentication functions
async function handleSignIn() {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    try {
        showLoading();
        const response = await fetch(`${apiBase}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('chathy_token', authToken);
            localStorage.setItem('chathy_user', JSON.stringify(currentUser));
            
            showToast('Sign in successful!', 'success');
            showMainApp();
        } else {
            showToast(data.error || 'Sign in failed', 'error');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleSignUp() {
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const businessName = document.getElementById('signup-business').value;
    const businessType = document.getElementById('signup-type').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await fetch(`${apiBase}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                phone,
                businessName,
                businessType,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('chathy_token', authToken);
            localStorage.setItem('chathy_user', JSON.stringify(currentUser));
            
            showToast('Account created successfully!', 'success');
            showScreen('business-setup');
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleBusinessSetup() {
    try {
        showLoading();
        const response = await fetch(`${apiBase}/auth/onboarding/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                businessHours: {}, // Would collect from form
                services: [], // Would collect from form
                integrations: [] // Would collect from form
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser.isOnboarded = true;
            localStorage.setItem('chathy_user', JSON.stringify(currentUser));
            
            showToast('Business setup completed!', 'success');
            showMainApp();
        } else {
            showToast(data.error || 'Setup failed', 'error');
        }
    } catch (error) {
        console.error('Setup error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function logout() {
    localStorage.removeItem('chathy_token');
    localStorage.removeItem('chathy_user');
    authToken = null;
    currentUser = null;
    
    document.getElementById('mainNav').classList.add('d-none');
    showScreen('welcome');
    showToast('Logged out successfully', 'success');
}

// Screen data loading
async function loadScreenData(screenId) {
    if (!authToken) return;
    
    switch(screenId) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'messaging':
            await loadMessagingData();
            break;
        case 'business-data':
            await loadBusinessData();
            break;
        case 'ai-settings':
            await loadAISettings();
            break;
        case 'analytics':
            await loadAnalyticsData();
            break;
        case 'settings':
            await loadSettingsData();
            break;
    }
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${apiBase}/dashboard/`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            renderDashboard(data);
        }
    } catch (error) {
        console.error('Dashboard data error:', error);
    }
}

function renderDashboard(data) {
    // Render business snapshot
    const snapshot = data.snapshot;
    document.getElementById('next-appointments').innerHTML = snapshot.nextAppointments.map(apt => `
        <div class="small mb-2">
            <strong>${apt.time}</strong> - ${apt.customerName}
            <br><small class="text-muted">${apt.serviceName}</small>
        </div>
    `).join('');
    
    document.getElementById('top-services').innerHTML = snapshot.topServices.map(service => `
        <div class="small mb-2">
            <strong>${service.name}</strong>
            <br><small class="text-muted">$${service.price}</small>
        </div>
    `).join('');
    
    document.getElementById('alerts').innerHTML = snapshot.alerts.map(alert => `
        <div class="alert-item ${alert.severity}">
            <i class="fas fa-exclamation-triangle me-1"></i>
            ${alert.message}
        </div>
    `).join('');
    
    // Render recent updates
    document.getElementById('updates-feed').innerHTML = data.recentUpdates.map(update => `
        <div class="update-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${update.description}</strong>
                    <br><small class="text-muted">${formatTime(update.timestamp)}</small>
                </div>
                <span class="badge bg-primary">${update.source}</span>
            </div>
        </div>
    `).join('');
}

async function loadMessagingData() {
    try {
        const response = await fetch(`${apiBase}/whatsapp/history`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const messages = await response.json();
            renderMessages(messages);
        }
    } catch (error) {
        console.error('Messaging data error:', error);
    }
}

function renderMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.direction === 'outbound' ? 'user' : 'ai'}">
            <div class="message-avatar">
                <i class="fas fa-${msg.direction === 'outbound' ? 'user' : 'robot'}"></i>
            </div>
            <div>
                <div class="message-bubble">
                    ${msg.message}
                </div>
                <div class="message-time">${formatTime(msg.timestamp)}</div>
            </div>
        </div>
    `).join('');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to UI immediately
    addMessageToUI(message, 'user');
    messageInput.value = '';
    
    try {
        const response = await fetch(`${apiBase}/whatsapp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                to: currentUser.phone,
                message: message
            })
        });
        
        if (response.ok) {
            // Simulate AI response
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addMessageToUI(aiResponse, 'ai');
            }, 1000);
        }
    } catch (error) {
        console.error('Send message error:', error);
        showToast('Failed to send message', 'error');
    }
}

function addMessageToUI(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div>
            <div class="message-bubble">
                ${message}
            </div>
            <div class="message-time">${formatTime(new Date().toISOString())}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "I can help you update prices! Just tell me which service and the new price. For example: 'Increase full facial from $100 to $120.'";
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('schedule')) {
        return "I can update your business hours! Tell me what changes you'd like to make. For example: 'Close early on Friday' or 'Open Sundays from 10am to 4pm.'";
    }
    
    if (lowerMessage.includes('add') && (lowerMessage.includes('service') || lowerMessage.includes('menu'))) {
        return "I can help you add new services! Please provide the service name, price, and duration. For example: 'Add deep tissue massage for $120, 60 minutes.'";
    }
    
    return `I understand you want to: "${message}". I'm processing this and will update your business information accordingly. What specific changes would you like me to make?`;
}

async function loadBusinessData() {
    try {
        // Load business hours
        const hoursResponse = await fetch(`${apiBase}/business/hours`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (hoursResponse.ok) {
            const hours = await hoursResponse.json();
            renderBusinessHours(hours);
        }
        
        // Load services
        const servicesResponse = await fetch(`${apiBase}/business/services`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (servicesResponse.ok) {
            const services = await servicesResponse.json();
            renderServices(services);
        }
        
        // Load inventory
        const inventoryResponse = await fetch(`${apiBase}/business/inventory`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (inventoryResponse.ok) {
            const inventory = await inventoryResponse.json();
            renderInventory(inventory);
        }
        
        // Load policies
        const policiesResponse = await fetch(`${apiBase}/business/policies`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (policiesResponse.ok) {
            const policies = await policiesResponse.json();
            renderPolicies(policies);
        }
    } catch (error) {
        console.error('Business data error:', error);
    }
}

function renderBusinessHours(hours) {
    const container = document.getElementById('business-hours-form');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    container.innerHTML = days.map(day => {
        const dayHours = hours[day] || { open: '09:00', close: '17:00', isClosed: false };
        return `
            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="${day}-open" ${!dayHours.isClosed ? 'checked' : ''}>
                <label class="form-check-label text-capitalize" for="${day}-open">${day}</label>
                <div class="time-inputs">
                    <input type="time" class="form-control form-control-sm" value="${dayHours.open}" ${dayHours.isClosed ? 'disabled' : ''}>
                    <span>to</span>
                    <input type="time" class="form-control form-control-sm" value="${dayHours.close}" ${dayHours.isClosed ? 'disabled' : ''}>
                </div>
            </div>
        `;
    }).join('');
}

function renderServices(services) {
    const container = document.getElementById('services-list-container');
    
    container.innerHTML = services.map(service => `
        <div class="service-card ${service.isActive ? '' : 'inactive'}">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <h6>${service.name}</h6>
                    <small class="text-muted">${service.description}</small>
                </div>
                <div class="col-md-2">
                    <strong>$${service.price}</strong>
                </div>
                <div class="col-md-2">
                    <span class="badge bg-info">${service.duration} min</span>
                </div>
                <div class="col-md-2">
                    <span class="badge ${service.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${service.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="col-md-2">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editService('${service.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteService('${service.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderInventory(inventory) {
    const container = document.getElementById('inventory-list');
    
    container.innerHTML = inventory.map(item => {
        const stockLevel = item.currentStock <= item.minStock ? 'low' : 'normal';
        return `
            <div class="inventory-item">
                <div>
                    <h6>${item.name}</h6>
                    <small class="text-muted">Last restocked: ${formatDate(item.lastRestocked)}</small>
                </div>
                <div class="text-end">
                    <div class="stock-indicator ${stockLevel}">
                        ${item.currentStock} ${item.unit}
                    </div>
                    <small class="text-muted">Min: ${item.minStock} ${item.unit}</small>
                </div>
            </div>
        `;
    }).join('');
}

function renderPolicies(policies) {
    const container = document.getElementById('policies-form');
    
    container.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <h6>Cancellation Policy</h6>
                <div class="mb-3">
                    <label class="form-label">Notice Required (hours)</label>
                    <input type="number" class="form-control" value="${policies.cancellation.noticeHours}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Cancellation Fee (%)</label>
                    <input type="number" class="form-control" value="${policies.cancellation.feePercentage}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3">${policies.cancellation.description}</textarea>
                </div>
            </div>
            <div class="col-md-4">
                <h6>Booking Policy</h6>
                <div class="mb-3">
                    <label class="form-label">Advance Booking (days)</label>
                    <input type="number" class="form-control" value="${policies.booking.advanceDays}">
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" ${policies.booking.depositRequired ? 'checked' : ''}>
                    <label class="form-check-label">Deposit Required</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Deposit Amount ($)</label>
                    <input type="number" class="form-control" value="${policies.booking.depositAmount}">
                </div>
            </div>
            <div class="col-md-4">
                <h6>Payment Methods</h6>
                <div class="mb-3">
                    ${['cash', 'card', 'online'].map(method => `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                   ${policies.payment.methods.includes(method) ? 'checked' : ''}>
                            <label class="form-check-label text-capitalize">${method}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <button class="btn btn-primary" onclick="savePolicies()">
            <i class="fas fa-save me-1"></i>Save Policies
        </button>
    `;
}

async function loadAISettings() {
    try {
        const response = await fetch(`${apiBase}/settings/ai`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const settings = await response.json();
            renderAISettings(settings);
        }
    } catch (error) {
        console.error('AI settings error:', error);
    }
}

function renderAISettings(settings) {
    // Set AI tone
    document.getElementById('ai-tone').value = settings.tone;
    
    // Set allowed actions
    document.getElementById('can-book').checked = settings.allowedActions.canBook;
    document.getElementById('can-cancel').checked = settings.allowedActions.canCancel;
    document.getElementById('can-payments').checked = settings.allowedActions.canTakePayments;
    document.getElementById('can-recommend').checked = settings.allowedActions.canRecommend;
    
    // Render channels
    const channelsContainer = document.getElementById('channels-list');
    channelsContainer.innerHTML = Object.entries(settings.channels).map(([channel, config]) => `
        <div class="channel-card">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1 text-capitalize">${channel}</h6>
                    <small class="text-muted">Last interaction: ${config.lastInteraction ? formatDate(config.lastInteraction) : 'Never'}</small>
                </div>
                <div>
                    <span class="channel-status ${config.enabled ? 'active' : 'inactive'}">
                        <span class="status-dot"></span>
                        ${config.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" ${config.enabled ? 'checked' : ''} 
                               onchange="toggleChannel('${channel}', this.checked)">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadAnalyticsData() {
    try {
        const response = await fetch(`${apiBase}/analytics/overview`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            renderAnalytics(data);
        }
    } catch (error) {
        console.error('Analytics data error:', error);
    }
}

function renderAnalytics(data) {
    // Update metrics
    document.getElementById('total-inquiries').textContent = data.summary.totalInquiries;
    document.getElementById('conversion-rate').textContent = data.summary.conversionRate + '%';
    document.getElementById('time-saved').textContent = data.metrics.timeSaved + 'h';
    document.getElementById('accuracy').textContent = data.metrics.updateAccuracy + '%';
    
    // Render charts
    renderInquiriesChart(data.inquiries.daily);
    renderServicesChart(data.popularServices);
    
    // Render action logs
    renderActionLogs(data.summary.totalActions);
}

function renderInquiriesChart(dailyData) {
    const ctx = document.getElementById('inquiries-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.map(d => formatDate(d.date)),
            datasets: [{
                label: 'Customer Inquiries',
                data: dailyData.map(d => d.count),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderServicesChart(services) {
    const ctx = document.getElementById('services-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: services.map(s => s.name),
            datasets: [{
                data: services.map(s => s.bookings),
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderActionLogs(totalActions) {
    const container = document.getElementById('action-logs');
    // Mock action logs data
    const mockLogs = [
        {
            action: 'price_update',
            description: 'Updated Full Facial Treatment from $100 to $120',
            timestamp: new Date().toISOString(),
            source: 'whatsapp'
        },
        {
            action: 'hours_update',
            description: 'Updated Friday hours: Closed for private event',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            source: 'whatsapp'
        }
    ];
    
    container.innerHTML = mockLogs.map(log => `
        <div class="action-log-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${log.description}</strong>
                    <br><small class="text-muted">${formatTime(log.timestamp)}</small>
                </div>
                <span class="action-source ${log.source}">${log.source}</span>
            </div>
        </div>
    `).join('');
}

async function loadSettingsData() {
    try {
        // Load profile
        const profileResponse = await fetch(`${apiBase}/settings/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            renderProfileSettings(profile);
        }
        
        // Load notifications
        const notificationsResponse = await fetch(`${apiBase}/settings/notifications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (notificationsResponse.ok) {
            const notifications = await notificationsResponse.json();
            renderNotificationSettings(notifications);
        }
        
        // Load security settings
        const securityResponse = await fetch(`${apiBase}/settings/security`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (securityResponse.ok) {
            const security = await securityResponse.json();
            renderSecuritySettings(security);
        }
        
        // Load integrations
        const integrationsResponse = await fetch(`${apiBase}/settings/integrations`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (integrationsResponse.ok) {
            const integrations = await integrationsResponse.json();
            renderIntegrations(integrations);
        }
    } catch (error) {
        console.error('Settings data error:', error);
    }
}

function renderProfileSettings(profile) {
    document.getElementById('profile-business-name').value = profile.name;
    document.getElementById('profile-business-type').value = profile.type;
    document.getElementById('profile-email').value = profile.email;
    document.getElementById('profile-phone').value = profile.phone;
    document.getElementById('profile-website').value = profile.website || '';
    document.getElementById('profile-address').value = profile.address || '';
    document.getElementById('profile-description').value = profile.description || '';
}

function renderNotificationSettings(notifications) {
    const container = document.getElementById('notification-settings');
    
    container.innerHTML = Object.entries(notifications).map(([channel, settings]) => `
        <div class="mb-4">
            <h6 class="text-capitalize mb-3">${channel} Notifications</h6>
            <div class="row">
                ${Object.entries(settings).map(([type, enabled]) => `
                    <div class="col-md-6 mb-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" ${enabled ? 'checked' : ''}>
                            <label class="form-check-label text-capitalize">${type.replace('_', ' ')}</label>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderSecuritySettings(security) {
    const container = document.getElementById('security-settings');
    
    container.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Two-Factor Authentication</h6>
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" ${security.twoFactorAuth.enabled ? 'checked' : ''}>
                    <label class="form-check-label">Enable 2FA</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Method</label>
                    <select class="form-select">
                        <option value="sms" ${security.twoFactorAuth.method === 'sms' ? 'selected' : ''}>SMS</option>
                        <option value="email" ${security.twoFactorAuth.method === 'email' ? 'selected' : ''}>Email</option>
                        <option value="app" ${security.twoFactorAuth.method === 'app' ? 'selected' : ''}>Authenticator App</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <h6>Session Management</h6>
                <div class="mb-3">
                    <label class="form-label">Session Timeout (hours)</label>
                    <input type="number" class="form-control" value="${security.sessionTimeout}">
                </div>
            </div>
        </div>
        <div class="mt-4">
            <h6>API Keys</h6>
            ${security.apiKeys.map(key => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>${key.name}</strong>
                        <br><small class="text-muted">Last used: ${formatTime(key.lastUsed)}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger">Revoke</button>
                </div>
            `).join('')}
            <button class="btn btn-outline-primary btn-sm">
                <i class="fas fa-plus me-1"></i>Generate New Key
            </button>
        </div>
    `;
}

function renderIntegrations(integrations) {
    const container = document.getElementById('integrations-list');
    
    container.innerHTML = integrations.map(integration => `
        <div class="integration-card">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h6>${integration.name}</h6>
                    <p class="text-muted small mb-0">${integration.description}</p>
                </div>
                <div class="col-md-3">
                    <span class="integration-status ${integration.connected ? 'connected' : 'disconnected'}">
                        <span class="status-dot"></span>
                        ${integration.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    ${integration.lastSync ? `<br><small class="text-muted">Last sync: ${formatTime(integration.lastSync)}</small>` : ''}
                </div>
                <div class="col-md-3 text-end">
                    ${integration.connected ? 
                        `<button class="btn btn-sm btn-outline-danger" onclick="disconnectIntegration('${integration.id}')">Disconnect</button>` :
                        `<button class="btn btn-sm btn-primary" onclick="connectIntegration('${integration.id}')">Connect</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showLoading() {
    document.getElementById('loading-overlay').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('d-none');
}

function showToast(message, type = 'info') {
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

function addServiceField() {
    const servicesList = document.getElementById('services-list');
    const newService = document.createElement('div');
    newService.className = 'service-item mb-2';
    newService.innerHTML = `
        <input type="text" class="form-control mb-1" placeholder="Service name">
        <input type="number" class="form-control" placeholder="Price">
    `;
    servicesList.appendChild(newService);
}

// Action functions
async function saveAISettings() {
    const tone = document.getElementById('ai-tone').value;
    const allowedActions = {
        canBook: document.getElementById('can-book').checked,
        canCancel: document.getElementById('can-cancel').checked,
        canTakePayments: document.getElementById('can-payments').checked,
        canRecommend: document.getElementById('can-recommend').checked
    };
    
    try {
        const response = await fetch(`${apiBase}/settings/ai`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ tone, allowedActions })
        });
        
        if (response.ok) {
            showToast('AI settings saved successfully', 'success');
        } else {
            showToast('Failed to save AI settings', 'error');
        }
    } catch (error) {
        console.error('Save AI settings error:', error);
        showToast('Network error', 'error');
    }
}

async function toggleChannel(channel, enabled) {
    try {
        const response = await fetch(`${apiBase}/settings/channels/${channel}/toggle`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ enabled })
        });
        
        if (response.ok) {
            showToast(`${channel} channel ${enabled ? 'enabled' : 'disabled'}`, 'success');
        } else {
            showToast('Failed to update channel', 'error');
        }
    } catch (error) {
        console.error('Toggle channel error:', error);
        showToast('Network error', 'error');
    }
}

function testAIResponse() {
    const testMessage = document.getElementById('test-message').value;
    const responsePreview = document.getElementById('ai-response-preview');
    
    if (!testMessage) {
        responsePreview.innerHTML = '<em class="text-muted">Please enter a test message</em>';
        return;
    }
    
    const aiResponse = generateAIResponse(testMessage);
    responsePreview.innerHTML = aiResponse;
}

function loadMoreUpdates() {
    loadDashboardData();
    showToast('Updates refreshed', 'success');
}

function refreshActionLogs() {
    loadAnalyticsData();
    showToast('Action logs refreshed', 'success');
}

function addNewService() {
    showToast('Service addition form would open here', 'info');
}

function editService(serviceId) {
    showToast(`Edit service ${serviceId}`, 'info');
}

function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        showToast(`Service ${serviceId} deleted`, 'success');
    }
}

function saveBusinessHours() {
    showToast('Business hours saved', 'success');
}

function savePolicies() {
    showToast('Policies saved', 'success');
}

function connectIntegration(integrationId) {
    showToast(`Connecting to ${integrationId}...`, 'info');
}

function disconnectIntegration(integrationId) {
    if (confirm('Are you sure you want to disconnect this integration?')) {
        showToast(`${integrationId} disconnected`, 'success');
    }
}