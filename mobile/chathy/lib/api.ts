const API_BASE = 'http://10.0.2.2:8000/api';

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
  name: string;
  description?: string;
  price: number;
  duration?: number;
}

export interface InventoryItem {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  category?: string;
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
    getAll: async (): Promise<Service[]> => {
      const response = await fetch(`${API_BASE}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    create: async (service: Omit<Service, 'id'>): Promise<Service> => {
      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error('Failed to create service');
      return response.json();
    },
  },
  inventory: {
    getAll: async (): Promise<InventoryItem[]> => {
      const response = await fetch(`${API_BASE}/inventory`);
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