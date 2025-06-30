import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants';
import { 
  TopGainersLosers, 
  CompanyOverview, 
  StockTimeSeries, 
  SearchResponse,
  CacheItem,
  Stock
} from '../types';
import { CacheService } from './cacheService';
import { transformAlphaVantageStocks } from '../utils/dataTransformers';

class AlphaVantageApi {
  private cacheService = new CacheService();
  private lastRequestTime = 0;

  private getApiConfig() {
    const isRapidAPI = API_CONFIG.PROVIDER === 'rapidapi';
    return {
      baseURL: isRapidAPI ? API_CONFIG.RAPIDAPI_BASE_URL : API_CONFIG.DEFAULT_BASE_URL,
      apiKey: isRapidAPI ? API_CONFIG.RAPIDAPI_KEY : API_CONFIG.DEFAULT_API_KEY,
      isRapidAPI,
    };
  }

  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    const config = this.getApiConfig();
    
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < API_CONFIG.REQUEST_DELAY) {
      const waitTime = API_CONFIG.REQUEST_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    const cacheKey = JSON.stringify({ ...params, provider: API_CONFIG.PROVIDER });
    const cachedData = await this.cacheService.get<T>(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached data for ${params.function} (${API_CONFIG.PROVIDER})`);
      return cachedData;
    }

    try {
      this.lastRequestTime = Date.now();
      
      let requestConfig: any;
      
      if (config.isRapidAPI) {
        // RapidAPI configuration
        requestConfig = {
          method: 'GET',
          url: config.baseURL,
          params: {
            ...params,
            datatype: 'json', // RapidAPI often requires this
          },
          headers: {
            'x-rapidapi-key': config.apiKey,
            'x-rapidapi-host': API_CONFIG.RAPIDAPI_HOST,
          },
          timeout: 10000,
        };
      } else {
        // Default Alpha Vantage configuration
        requestConfig = {
          method: 'GET',
          url: config.baseURL,
          params: {
            ...params,
            apikey: config.apiKey,
          },
          timeout: 10000,
        };
      }

      console.log(`Making ${API_CONFIG.PROVIDER} API request for ${params.function}...`);
      const response = await axios.request(requestConfig);

      // Log detailed response for debugging
      console.log('=== API Response Debug ===');
      console.log('Provider:', API_CONFIG.PROVIDER);
      console.log('Request params:', { ...params, apikey: 'HIDDEN' });
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      console.log('========================');

      if (response.data.Note) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      if (response.data.Error) {
        throw new Error(response.data.Error);
      }

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message']);
      }

      // Cache the response
      await this.cacheService.set(cacheKey, response.data, API_CONFIG.CACHE_DURATION);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async getTopGainersLosers(): Promise<{ top_gainers: Stock[]; top_losers: Stock[]; most_actively_traded: Stock[]; metadata: { information: string; last_updated: string; } }> {
    console.log('Fetching top gainers/losers from Alpha Vantage...');
    const response = await this.makeRequest<TopGainersLosers>({
      function: API_ENDPOINTS.TOP_GAINERS_LOSERS,
    });

    // Transform the Alpha Vantage format to our internal format
    return {
      top_gainers: transformAlphaVantageStocks(response.top_gainers),
      top_losers: transformAlphaVantageStocks(response.top_losers),
      most_actively_traded: transformAlphaVantageStocks(response.most_actively_traded),
      metadata: {
        information: response.metadata,
        last_updated: response.last_updated,
      },
    };
  }

  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    console.log(`Fetching company overview for ${symbol}...`);
    return this.makeRequest<CompanyOverview>({
      function: API_ENDPOINTS.COMPANY_OVERVIEW,
      symbol: symbol.toUpperCase(),
    });
  }

  async getTimeSeriesDaily(symbol: string): Promise<StockTimeSeries> {
    console.log(`Fetching time series data for ${symbol}...`);
    return this.makeRequest<StockTimeSeries>({
      function: API_ENDPOINTS.TIME_SERIES_DAILY,
      symbol: symbol.toUpperCase(),
      outputsize: 'compact',
    });
  }

  async searchSymbol(keywords: string): Promise<SearchResponse> {
    console.log(`Searching for symbol: ${keywords}...`);
    return this.makeRequest<SearchResponse>({
      function: API_ENDPOINTS.SYMBOL_SEARCH,
      keywords,
    });
  }
}

export const alphaVantageApi = new AlphaVantageApi();