import { AlphaVantageStock, Stock } from '../types';

export const transformAlphaVantageStock = (alphaStock: AlphaVantageStock): Stock => {
  return {
    symbol: alphaStock.ticker,
    name: alphaStock.ticker, // Alpha Vantage doesn't provide company names in this endpoint
    price: alphaStock.price,
    change: alphaStock.change_amount,
    changePercent: alphaStock.change_percentage,
    volume: alphaStock.volume,
  };
};

export const transformAlphaVantageStocks = (alphaStocks: AlphaVantageStock[]): Stock[] => {
  return alphaStocks.map(transformAlphaVantageStock);
};