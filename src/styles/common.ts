import { StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS } from '../constants';

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
    padding: DIMENSIONS.padding,
  },
  
  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.borderRadius,
    padding: DIMENSIONS.padding,
    margin: DIMENSIONS.margin / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: DIMENSIONS.cardElevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: DIMENSIONS.cardElevation,
  },
  
  // Typography
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: DIMENSIONS.borderRadius,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: DIMENSIONS.borderRadius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Form elements
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  
  // Grid layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing
  marginTop: {
    marginTop: DIMENSIONS.margin,
  },
  marginBottom: {
    marginBottom: DIMENSIONS.margin,
  },
  paddingHorizontal: {
    paddingHorizontal: DIMENSIONS.padding,
  },
  paddingVertical: {
    paddingVertical: DIMENSIONS.padding,
  },
});