// Alpha Vantage API Configuration
export const API_CONFIG = {
  // API Provider: 'default' for direct Alpha Vantage, 'rapidapi' for RapidAPI
  PROVIDER: 'rapidapi' as 'default' | 'rapidapi', // Change to 'default' to use direct Alpha Vantage
  
  // Default Alpha Vantage API
  DEFAULT_BASE_URL: 'https://www.alphavantage.co/query',
  DEFAULT_API_KEY: '',
  
  // RapidAPI Alpha Vantage
  RAPIDAPI_BASE_URL: 'https://alpha-vantage.p.rapidapi.com/query',
  RAPIDAPI_KEY: '',
  RAPIDAPI_HOST: 'alpha-vantage.p.rapidapi.com',
  
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  REQUEST_DELAY: 5000, // 5 seconds between requests for RapidAPI (more generous limits)
};

// API Endpoints
export const API_ENDPOINTS = {
  TOP_GAINERS_LOSERS: 'TOP_GAINERS_LOSERS',
  COMPANY_OVERVIEW: 'OVERVIEW',
  TIME_SERIES_DAILY: 'TIME_SERIES_DAILY',
  SYMBOL_SEARCH: 'SYMBOL_SEARCH',
};

// Colors - Light Theme
export const LIGHT_COLORS = {
  primary: '#1E88E5',
  secondary: '#FFC107',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  positive: '#4CAF50',
  negative: '#F44336',
};

// Colors - Dark Theme
export const DARK_COLORS = {
  primary: '#42A5F5',
  secondary: '#FFD54F',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  positive: '#66BB6A',
  negative: '#EF5350',
};

export const COLORS = LIGHT_COLORS;

// Dimensions
export const DIMENSIONS = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  cardElevation: 2,
};

// Storage Keys
export const STORAGE_KEYS = {
  WATCHLISTS: 'watchlists',
  CACHE_PREFIX: 'cache_',
};

// Default values
export const DEFAULT_VALUES = {
  ITEMS_PER_PAGE: 20,
  MAX_WATCHLISTS: 10,
  CHART_DAYS: 30,
};