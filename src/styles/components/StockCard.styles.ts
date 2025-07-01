import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../../constants';
import { ThemeColors } from '../../hooks/useTheme';

export const stockCardStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: DIMENSIONS.borderRadius,
    padding: DIMENSIONS.padding,
    margin: DIMENSIONS.margin / 2,
    flex: 1,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: DIMENSIONS.cardElevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: DIMENSIONS.cardElevation,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  changePercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    minHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
});