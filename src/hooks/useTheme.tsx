import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants';

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  positive: string;
  negative: string;
}

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription?.remove();
  }, []);

  const colors = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const isDark = colorScheme === 'dark';

  const value: ThemeContextType = {
    colorScheme,
    colors,
    isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
