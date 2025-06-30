import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stock } from '../../types';
import { COLORS, DIMENSIONS } from '../../constants';

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
          { color: isPositive ? COLORS.positive : COLORS.negative }
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
          { color: isPositive ? COLORS.positive : COLORS.negative }
        ]}>
          {isPositive ? '+' : ''}${parseFloat(change).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
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
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  changePercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    color: COLORS.text,
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StockCard;