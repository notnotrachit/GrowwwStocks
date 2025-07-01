import { StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS } from '../../constants';

export const productScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    marginRight: DIMENSIONS.padding,
  },
  
  // Price Section
  priceSection: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.padding,
    marginBottom: DIMENSIONS.margin,
  },
  priceHeader: {
    marginBottom: 12,
  },
  stockTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stockName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 12,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  
  // Chart Section
  chartContainer: {
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
  },
  
  // Sections
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
    padding: DIMENSIONS.padding,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.margin,
  },
  
  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: DIMENSIONS.margin,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  
  // Overview Items
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  overviewLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    flex: 1,
  },
  overviewValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  
  // Description
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  websiteLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  
  // No Data State
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noDataMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});