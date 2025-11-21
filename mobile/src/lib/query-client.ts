import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError?.response?.status === 401) return false
        return failureCount < 3
      },
    },
  },
})