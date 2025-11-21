import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
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
      AsyncStorage.removeItem('token')
      // Navigate to login, but since no navigation here, perhaps emit event or something
      // For now, just show toast
    }
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error.response?.data?.message || 'An error occurred',
    })
    return Promise.reject(error)
  }
)

export default api