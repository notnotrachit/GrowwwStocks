import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../../constants';
import { ThemeColors } from '../../hooks/useTheme';

export const stockCardStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: DIMENSIONS.padding + 2,
    margin: DIMENSIONS.margin / 2,
    flex: 1,
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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