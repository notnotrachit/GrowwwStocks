import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stock } from '../../types';
import { stockCardStyles as styles } from '../../styles/components/StockCard.styles';
import { getPercentageChangeStyle, getPriceChangeStyle } from '../../utils/styleUtils';

interface StockCardProps {
  stock: Stock;
  onPress: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onPress }) => {
  // Safely handle potentially undefined values
  const changePercent = stock.changePercent || '0%';
  const change = stock.change || '0';
  const price = stock.price || '0';
  
  const isPositive = parseFloat(changePercent.replace('%', '')) >= 0;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.symbol} numberOfLines={1}>
          {stock.symbol || 'N/A'}
        </Text>
        <Text style={[
          styles.changePercent,
          getPercentageChangeStyle(changePercent)
        ]}>
          {changePercent}
        </Text>
      </View>
      
      <Text style={styles.name} numberOfLines={2}>
        {stock.name || 'Unknown Stock'}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.price}>
          ${parseFloat(price).toFixed(2)}
        </Text>
        <Text style={[
          styles.change,
          getPriceChangeStyle(change)
        ]}>
          {isPositive ? '+' : ''}${parseFloat(change).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default StockCard;