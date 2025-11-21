import axios from 'axios'
import { toast } from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    toast.error(error.response?.data?.message || 'An error occurred')
    return Promise.reject(error)
  }
)

// API functions
export const getCustomers = () => api.get('/customers');
export const createCustomer = (data: any) => api.post('/customers', data);

export const getServices = () => api.get('/services');
export const createService = (data: any) => api.post('/services', data);

export const getInventory = () => api.get('/inventory');
export const createInventoryItem = (data: any) => api.post('/inventory', data);

export const getAppointments = () => api.get('/appointments');
export const createAppointment = (data: any) => api.post('/appointments', data);

export const getInvoices = () => api.get('/invoices');
export const createInvoice = (data: any) => api.post('/invoices', data);

export const getBusinessHours = () => api.get('/business-hours');
export const createBusinessHours = (data: any) => api.post('/business-hours', data);

export const getPolicies = () => api.get('/policies');
export const createPolicy = (data: any) => api.post('/policies', data);

export const getLogs = () => api.get('/logs');

export const chat = (message: string) => api.post('/chat', { message });

export default api