export const validateWatchlistName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Watchlist name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Watchlist name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Watchlist name must be less than 50 characters' };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: 'Watchlist name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateSymbol = (symbol: string): { isValid: boolean; error?: string } => {
  if (!symbol.trim()) {
    return { isValid: false, error: 'Stock symbol is required' };
  }
  
  // Basic symbol validation (letters, numbers, dots, hyphens)
  const symbolPattern = /^[A-Za-z0-9.-]+$/;
  if (!symbolPattern.test(symbol.trim())) {
    return { isValid: false, error: 'Invalid stock symbol format' };
  }
  
  if (symbol.trim().length > 10) {
    return { isValid: false, error: 'Stock symbol is too long' };
  }
  
  return { isValid: true };
};

export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query.trim()) {
    return { isValid: false, error: 'Search query is required' };
  }
  
  if (query.trim().length < 1) {
    return { isValid: false, error: 'Search query must be at least 1 character' };
  }
  
  if (query.trim().length > 100) {
    return { isValid: false, error: 'Search query is too long' };
  }
  
  return { isValid: true };
};