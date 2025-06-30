import { CompanyOverview } from '../types';

export const isCompanyDataEmpty = (data: CompanyOverview): boolean => {
  // Check if essential fields are missing or empty
  const essentialFields = [
    'Name',
    'Sector',
    'Industry',
    'Exchange',
    'MarketCapitalization'
  ];

  // If most essential fields are missing or "None", consider it empty
  const emptyFieldsCount = essentialFields.filter(field => {
    const value = data[field as keyof CompanyOverview];
    return !value || value === 'None' || value === '-' || value === '';
  }).length;

  // If more than half of essential fields are empty, consider the data insufficient
  return emptyFieldsCount > essentialFields.length / 2;
};

export const hasMinimalCompanyData = (data: CompanyOverview): boolean => {
  // Check if we have at least a name and symbol
  return !!(data.Symbol && data.Name && data.Name !== 'None' && data.Name !== '-');
};