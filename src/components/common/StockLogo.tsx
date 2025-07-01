import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

interface StockLogoProps {
  symbol: string;
  size?: number;
  style?: any;
}

const StockLogo: React.FC<StockLogoProps> = ({ symbol, size = 40, style }) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = `https://raw.githubusercontent.com/notnotrachit/tickericons/refs/heads/main/ticker_icons/${symbol.toUpperCase()}.png`;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size,
    backgroundColor: "#e2e2e2",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: size - 4, 
    height: size - 4,
  };

  if (imageError) {
    // Fallback to icon if image fails to load
    return (
      <View style={[containerStyle, style]}>
        <Ionicons 
          name="business-outline" 
          size={size * 0.5} 
          color={COLORS.textSecondary} 
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Image
        source={{ uri: logoUrl }}
        style={imageStyle}
        onError={() => setImageError(true)}
        resizeMode="contain"
      />
    </View>
  );
};

export default StockLogo;