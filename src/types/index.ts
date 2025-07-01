export interface Stock {
  change: string;
  changePercent: string;
  symbol: string;
  name: string;
  price: string;
  volume: string;
}

// Alpha Vantage API response forma

export interface AlphaVantageStock {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface TopGainersLosers {
  metadata: string;
  last_updated: string;
  top_gainers: AlphaVantageStock[];
  top_losers: AlphaVantageStock[];
  most_actively_traded: AlphaVantageStock[];
}

export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  OfficialSite: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  DividendDate: string;
  ExDividendDate: string;
}

export interface TimeSeriesData {
  [date: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface StockTimeSeries {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': TimeSeriesData;
}

export interface SearchResult {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

export interface SearchResponse {
  bestMatches: SearchResult[];
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: string;
  updatedAt: string;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ProductScreen: { symbol: string; name: string };
  ViewAllScreen: { type: 'gainers' | 'losers'; title: string };
  SearchScreen: undefined;
};

export type MainTabParamList = {
  Explore: undefined;
  Watchlist: undefined;
};

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}