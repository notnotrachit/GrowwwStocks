import { API_CONFIG } from '../constants';

export const switchToDefaultAPI = () => {
  console.log('Switching to Default Alpha Vantage API');
  (API_CONFIG as any).PROVIDER = 'default';
  (API_CONFIG as any).REQUEST_DELAY = 12000; // 12 seconds for default API
};

export const switchToRapidAPI = () => {
  console.log('Switching to RapidAPI Alpha Vantage');
  (API_CONFIG as any).PROVIDER = 'rapidapi';
  (API_CONFIG as any).REQUEST_DELAY = 5000; // 5 seconds for RapidAPI
};

export const getCurrentProvider = () => {
  return API_CONFIG.PROVIDER;
};

export const getProviderInfo = () => {
  const isRapidAPI = API_CONFIG.PROVIDER === 'rapidapi';
  return {
    provider: API_CONFIG.PROVIDER,
    baseURL: isRapidAPI ? API_CONFIG.RAPIDAPI_BASE_URL : API_CONFIG.DEFAULT_BASE_URL,
    requestDelay: API_CONFIG.REQUEST_DELAY,
    rateLimits: isRapidAPI 
      ? 'RapidAPI: Higher limits, faster requests'
      : 'Default: 5 requests/minute, 500 requests/day',
  };
};