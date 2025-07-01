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
      value: formatLargeNumber(data.MarketCapitalization),
      trend: 'neutral' as const
    });
  }

  if (hasValue(data.PERatio)) {
    metrics.push({
      label: 'P/E Ratio',
      value: data.PERatio,
      trend: 'neutral' as const
    });
  }

  if (hasValue(data.EPS)) {
    metrics.push({
      label: 'EPS',
      value: `$${data.EPS}`,
      trend: 'neutral' as const
    });
  }

  if (hasValue(data.Beta)) {
    const betaValue = parseFloat(data.Beta);
    metrics.push({
      label: 'Beta',
      value: data.Beta,
      trend: betaValue > 1 ? 'up' as const : betaValue < 1 ? 'down' as const : 'neutral' as const
    });
  }

  if (hasValue(data['52WeekHigh'])) {
    metrics.push({
      label: '52W High',
      value: `$${data['52WeekHigh']}`,
      trend: 'up' as const
    });
  }

  if (hasValue(data['52WeekLow'])) {
    metrics.push({
      label: '52W Low',
      value: `$${data['52WeekLow']}`,
      trend: 'down' as const
    });
  }

  if (hasValue(data.RevenueTTM)) {
    metrics.push({
      label: 'Revenue TTM',
      value: formatLargeNumber(data.RevenueTTM),
      trend: 'neutral' as const
    });
  }

  if (hasValue(data.ProfitMargin)) {
    const marginValue = parseFloat(data.ProfitMargin);
    metrics.push({
      label: 'Profit Margin',
      value: formatPercentage(data.ProfitMargin),
      trend: marginValue > 0.15 ? 'up' as const : marginValue < 0.05 ? 'down' as const : 'neutral' as const
    });
  }

  if (hasValue(data.BookValue)) {
    metrics.push({
      label: 'Book Value',
      value: `$${data.BookValue}`,
      trend: 'neutral' as const
    });
  }

  if (hasValue(data.EBITDA)) {
    metrics.push({
      label: 'EBITDA',
      value: formatLargeNumber(data.EBITDA),
      trend: 'neutral' as const
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

  if (hasValue(data.FiscalYearEnd)) {
    info.push({ label: 'Fiscal Year End', value: data.FiscalYearEnd });
  }

  if (hasValue(data.Address)) {
    info.push({ label: 'Address', value: data.Address });
  }

  return info;
};

export const getCompanyTags = (data: CompanyOverview) => {
  const tags = [];

  if (hasValue(data.Exchange)) {
    tags.push({ label: 'Exchange', value: data.Exchange, variant: 'accent' as const });
  }

  if (hasValue(data.Currency)) {
    tags.push({ label: 'Currency', value: data.Currency, variant: 'default' as const });
  }

  if (hasValue(data.Country)) {
    tags.push({ label: 'Country', value: data.Country, variant: 'outline' as const });
  }

  if (hasValue(data.AssetType)) {
    tags.push({ label: 'Type', value: data.AssetType, variant: 'default' as const });
  }

  return tags;
};