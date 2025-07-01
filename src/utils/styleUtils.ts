import { COLORS } from '../constants';

export const getChangeColor = (isPositive: boolean): string => {
  return isPositive ? COLORS.positive : COLORS.negative;
};

export const getPriceChangeStyle = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
  const isPositive = numValue >= 0;
  return {
    color: getChangeColor(isPositive)
  };
};

export const getPercentageChangeStyle = (changePercent: string) => {
  const isPositive = parseFloat(changePercent.replace('%', '')) >= 0;
  return {
    color: getChangeColor(isPositive)
  };
};