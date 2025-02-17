import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Connection state management
let isReconnecting = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 30000; // 30 seconds

// Custom fetch implementation with retry logic
const customFetch = async (url: string, options: RequestInit = {}) => {
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 1000; // 1 second

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset connection attempts on successful request
      connectionAttempts = 0;
      isReconnecting = false;
      
      return response;
    } catch (error: any) {
      attempt++;
      connectionAttempts++;

      // Log detailed error information in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Fetch error:', {
          attempt,
          connectionAttempts,
          error: error.message,
          url: url.split('?')[0] // Log URL without query params for security
        });
      }

      // If we've exceeded max connection attempts, reset and throw
      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        connectionAttempts = 0;
        isReconnecting = false;
        throw new Error('Maximum connection attempts reached. Please try again later.');
      }

      // If we've used all retries for this request, throw
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      // Calculate backoff time with jitter
      const jitter = Math.random() * 1000; // Random delay between 0-1000ms
      const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1) + jitter;

      // If it's not a timeout error and not the last attempt, wait and retry
      if (error.name !== 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  throw new Error('Max retries reached');
};

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(
  'https://gdscregnum.me',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4OTUzMDAwLAogICJleHAiOiAxODk2NzE5NDAwCn0.JuaouKMNgs7SS7Z-9Y68shzOI5CEsdQXBfZJESPqXUY',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development'
    },
    global: {
      headers: {
        'x-my-custom-header': 'technikaz',
      },
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    fetch: customFetch
  }
);

// Enhanced error handler
supabase.handleError = (error: any) => {
  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Supabase error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      connectionAttempts,
      isReconnecting
    });
  }

  // Network errors
  if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
    if (!isReconnecting) {
      isReconnecting = true;
      checkSupabaseConnection(); // Trigger reconnection attempt
    }
    return {
      message: connectionAttempts > 1 
        ? 'Still trying to reconnect... Please wait.'
        : 'Network connection error. Attempting to reconnect...',
      code: 'NETWORK_ERROR',
      isRetryable: true
    };
  }

  // Auth errors
  if (error.__isAuthError) {
    // Clear session on auth error
    supabase.auth.signOut();
    return {
      message: 'Your session has expired. Please log in again.',
      code: 'AUTH_ERROR',
      isRetryable: false
    };
  }

  // Resource not found
  if (error.code === 'PGRST116') {
    return {
      message: 'The requested resource was not found.',
      code: 'NOT_FOUND',
      isRetryable: false
    };
  }

  // Data validation errors
  if (error.code?.startsWith('23')) {
    return {
      message: 'There was a problem with the data. Please check your input and try again.',
      code: 'DATA_ERROR',
      isRetryable: false
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: 'UNKNOWN_ERROR',
    isRetryable: true
  };
};

// Enhanced connection health check
export const checkSupabaseConnection = async () => {
  if (isReconnecting) return false;

  try {
    const { data, error } = await supabase.from('blogs').select('id').limit(1);
    if (error) throw error;
    
    // Reset connection state on success
    connectionAttempts = 0;
    isReconnecting = false;
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Connection recovery mechanism
const attemptReconnection = async () => {
  if (isReconnecting || connectionAttempts >= MAX_CONNECTION_ATTEMPTS) return;

  isReconnecting = true;
  while (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
    try {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        isReconnecting = false;
        connectionAttempts = 0;
        return true;
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
    }

    // Exponential backoff with jitter
    const backoff = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
    const jitter = Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, backoff + jitter));
    
    connectionAttempts++;
  }

  isReconnecting = false;
  return false;
};

// Periodic health check with automatic recovery
if (typeof window !== 'undefined') {
  let healthCheckInterval: number;

  const startHealthCheck = () => {
    healthCheckInterval = window.setInterval(async () => {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected && !isReconnecting) {
        attemptReconnection();
      }
    }, 30000); // Check every 30 seconds
  };

  const stopHealthCheck = () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  };

  // Start health check when window is focused
  window.addEventListener('focus', startHealthCheck);
  window.addEventListener('online', () => {
    connectionAttempts = 0;
    attemptReconnection();
  });

  // Stop health check when window is not focused
  window.addEventListener('blur', stopHealthCheck);
  window.addEventListener('offline', stopHealthCheck);

  // Initial health check
  startHealthCheck();
}