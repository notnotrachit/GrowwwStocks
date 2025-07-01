import { StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS } from '../../constants';

export const searchScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Search Input Section
  searchContainer: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.borderRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: DIMENSIONS.borderRadius,
  },
  searchButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Results List
  resultsList: {
    padding: DIMENSIONS.padding,
  },
  resultItem: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.borderRadius,
    padding: DIMENSIONS.padding,
    marginBottom: DIMENSIONS.margin,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  resultHeader: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  matchScore: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  region: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.padding,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: DIMENSIONS.borderRadius,
  },
  retryText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});