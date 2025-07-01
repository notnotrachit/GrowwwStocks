import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../../constants';
import { ThemeColors } from '../../hooks/useTheme';

export const productScreenStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    marginRight: DIMENSIONS.padding,
  },
  
  // Price Section
  priceSection: {
    backgroundColor: colors.surface,
    padding: DIMENSIONS.padding + 8,
    marginBottom: DIMENSIONS.margin + 4,
    borderRadius: 20,
    marginHorizontal: DIMENSIONS.margin,
    marginTop: DIMENSIONS.margin,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  priceHeader: {
    marginBottom: 16,
  },
  stockTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockTitleText: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
    flexShrink: 0, // Prevent shrinking
  },
  websiteButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  stockSymbol: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  stockName: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
    flex: 1, // Take available space
    marginRight: 8, // Add margin to separate from button
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginRight: 12,
    letterSpacing: -0.5,
  },
  lastUpdated: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Tags Section
  tagsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: DIMENSIONS.margin,
    marginBottom: DIMENSIONS.margin + 4,
    borderRadius: 20,
    padding: DIMENSIONS.padding + 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  
  // Chart Section
  chartContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: DIMENSIONS.margin,
    marginBottom: DIMENSIONS.margin + 4,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  
  // Sections
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: DIMENSIONS.margin,
    marginBottom: DIMENSIONS.margin + 4,
    padding: DIMENSIONS.padding + 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: DIMENSIONS.margin + 4,
    letterSpacing: 0.3,
  },
  
  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoItem: {
    width: '48%',
  },
  
  // Overview Items
  overviewItem: {
    flexDirection: 'column',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overviewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Description
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '400',
  },
  websiteLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  // No Data State
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  noDataMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // About Section
  aboutLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  aboutText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontWeight: '400',
  },
  aboutToggle: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 2,
  },
});