import { CompanyOverview } from '../types';

export const hasValue = (value: string | undefined): boolean => {
  if (!value) return false;
  const cleanValue = value.toString().trim();
  return cleanValue !== '' && 
         cleanValue !== 'None' && 
         cleanValue !== '-' && 
         cleanValue !== '0' &&
         cleanValue !== '0.000' &&
         cleanValue !== '0.0';
};

export const formatPercentage = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return `${(num * 100).toFixed(2)}%`;
};

export const formatLargeNumber = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  
  return `$${num.toLocaleString()}`;
};

export const getAvailableMetrics = (data: CompanyOverview) => {
  const metrics = [];

  if (hasValue(data.MarketCapitalization)) {
    metrics.push({
      label: 'Market Cap',
      value: formatLargeNumber(data.MarketCapitalization)
    });
  }

  if (hasValue(data.PERatio)) {
    metrics.push({
      label: 'P/E Ratio',
      value: data.PERatio
    });
  }

  if (hasValue(data.EPS)) {
    metrics.push({
      label: 'EPS',
      value: `$${data.EPS}`
    });
  }

  if (hasValue(data.Beta)) {
    metrics.push({
      label: 'Beta',
      value: data.Beta
    });
  }

  if (hasValue(data['52WeekHigh'])) {
    metrics.push({
      label: '52W High',
      value: `$${data['52WeekHigh']}`
    });
  }

  if (hasValue(data['52WeekLow'])) {
    metrics.push({
      label: '52W Low',
      value: `$${data['52WeekLow']}`
    });
  }

  if (hasValue(data.RevenueTTM)) {
    metrics.push({
      label: 'Revenue TTM',
      value: formatLargeNumber(data.RevenueTTM)
    });
  }

  if (hasValue(data.ProfitMargin)) {
    metrics.push({
      label: 'Profit Margin',
      value: formatPercentage(data.ProfitMargin)
    });
  }

  if (hasValue(data.BookValue)) {
    metrics.push({
      label: 'Book Value',
      value: `$${data.BookValue}`
    });
  }

  if (hasValue(data.EBITDA)) {
    metrics.push({
      label: 'EBITDA',
      value: formatLargeNumber(data.EBITDA)
    });
  }

  return metrics;
};

export const getAvailableCompanyInfo = (data: CompanyOverview) => {
  const info = [];

  if (hasValue(data.Sector)) {
    info.push({ label: 'Sector', value: data.Sector });
  }

  if (hasValue(data.Industry)) {
    info.push({ label: 'Industry', value: data.Industry });
  }

  if (hasValue(data.Exchange)) {
    info.push({ label: 'Exchange', value: data.Exchange });
  }

  if (hasValue(data.Country)) {
    info.push({ label: 'Country', value: data.Country });
  }

  if (hasValue(data.Currency)) {
    info.push({ label: 'Currency', value: data.Currency });
  }

  if (hasValue(data.FiscalYearEnd)) {
    info.push({ label: 'Fiscal Year End', value: data.FiscalYearEnd });
  }

  return info;
};