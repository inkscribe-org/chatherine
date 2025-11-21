const API_BASE = 'http://localhost:3000/api';

// Error handling utility
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth token helper (in a real app, this would come from secure storage)
function getAuthToken(): string {
  // For demo purposes, return a mock token
  // In production, this would retrieve from secure storage
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvaG5Ac3BhYnVzaW5lc3MuY29tIiwiaWF0IjoxNzYzNzY0OTA3LCJleHAiOjE3NjQzNjk3MDd9.eLV_japn7JrC_unv3nScQhsioPq0hRRY1SPjP9j4VmQ';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new ApiError(
      errorMessage,
      response.status,
      response.status.toString()
    );
  }
  
  return response.json();
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  business_type?: string;
  business_address?: string;
}

export interface Log {
  id?: number;
  timestamp: string;
  action: string;
  details?: string;
}

export interface Service {
  id?: number;
  customer_id?: number;
  name: string;
  description?: string;
  price: number;
  duration?: number;
}

export interface BusinessService {
  id?: number;
  customer_id?: number;
  name: string;
  description?: string;
  category: string;
  price?: number;
  duration?: string;
  is_available: boolean;
  custom_data?: string;
}

export interface BusinessFact {
  id?: number;
  customer_id?: number;
  title: string;
  content: string;
  category: string;
  is_public: boolean;
}

export interface InventoryItem {
  id?: number;
  customer_id?: number;
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface BusinessHours {
  id?: number;
  customer_id?: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface Policy {
  id?: number;
  customer_id?: number;
  title: string;
  content: string;
  category: string;
}

export const api = {
  customers: {
    getAll: async (): Promise<Customer[]> => {
      const response = await fetch(`${API_BASE}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
      const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      return response.json();
    },
  },
  logs: {
    getAll: async (): Promise<Log[]> => {
      const response = await fetch(`${API_BASE}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
  },
  services: {
    getAll: async (customerId?: number): Promise<Service[]> => {
      const url = customerId ? `${API_BASE}/services/${customerId}` : `${API_BASE}/services`;
      const response = await fetch(url);
      return handleResponse<Service[]>(response);
    },
    create: async (service: Omit<Service, 'id'>): Promise<Service> => {
      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      return handleResponse<Service>(response);
    },
    update: async (id: number, service: Omit<Service, 'id'>): Promise<Service> => {
      const response = await fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error('Failed to update service');
      return response.json();
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
    },
  },
  businessServices: {
    getAll: async (customerId: number): Promise<BusinessService[]> => {
      const response = await fetch(`${API_BASE}/business/services`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse<BusinessService[]>(response);
    },
    create: async (service: Omit<BusinessService, 'id'>): Promise<BusinessService> => {
      const response = await fetch(`${API_BASE}/business/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(service),
      });
      return handleResponse<BusinessService>(response);
    },
    update: async (id: number, service: Omit<BusinessService, 'id'>): Promise<BusinessService> => {
      const response = await fetch(`${API_BASE}/business/services/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(service),
      });
      return handleResponse<BusinessService>(response);
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/business/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse<void>(response);
    },
  },
  businessFacts: {
    getAll: async (customerId: number): Promise<BusinessFact[]> => {
      const response = await fetch(`${API_BASE}/business-facts/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch business facts');
      return response.json();
    },
    create: async (fact: Omit<BusinessFact, 'id'>): Promise<BusinessFact> => {
      const response = await fetch(`${API_BASE}/business-facts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fact),
      });
      if (!response.ok) throw new Error('Failed to create business fact');
      return response.json();
    },
    update: async (id: number, fact: Omit<BusinessFact, 'id'>): Promise<BusinessFact> => {
      const response = await fetch(`${API_BASE}/business-facts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fact),
      });
      if (!response.ok) throw new Error('Failed to update business fact');
      return response.json();
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/business-facts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete business fact');
    },
  },
  inventory: {
    getAll: async (customerId?: number): Promise<InventoryItem[]> => {
      const url = customerId ? `${API_BASE}/inventory/${customerId}` : `${API_BASE}/inventory`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    },
    create: async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to create inventory item');
      return response.json();
    },
    update: async (id: number, item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to update inventory item');
      return response.json();
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete inventory item');
    },
  },
  businessHours: {
    getAll: async (customerId: number): Promise<BusinessHours[]> => {
      const response = await fetch(`${API_BASE}/business/hours`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return handleResponse<BusinessHours[]>(response);
    },
    create: async (hours: Omit<BusinessHours, 'id'>): Promise<BusinessHours> => {
      const response = await fetch(`${API_BASE}/business/hours`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(hours),
      });
      return handleResponse<BusinessHours>(response);
    },
    update: async (hours: BusinessHours): Promise<BusinessHours> => {
      const response = await fetch(`${API_BASE}/business/hours`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(hours),
      });
      return handleResponse<BusinessHours>(response);
    },
  },
  policies: {
    getAll: async (customerId: number): Promise<Policy[]> => {
      const response = await fetch(`${API_BASE}/policies/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch policies');
      return response.json();
    },
    create: async (policy: Omit<Policy, 'id'>): Promise<Policy> => {
      const response = await fetch(`${API_BASE}/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      if (!response.ok) throw new Error('Failed to create policy');
      return response.json();
    },
    update: async (id: number, policy: Omit<Policy, 'id'>): Promise<Policy> => {
      const response = await fetch(`${API_BASE}/policies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      if (!response.ok) throw new Error('Failed to update policy');
      return response.json();
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE}/policies/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete policy');
    },
  },
  chat: {
    sendMessage: async (message: string): Promise<{ response: string }> => {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
  },
};