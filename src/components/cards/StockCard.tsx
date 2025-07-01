import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Stock } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import {
  getPercentageChangeStyle,
  getPriceChangeStyle,
} from "../../utils/styleUtils";
import StockLogo from "../common/StockLogo";
import { stockCardStyles } from "../../styles/components/StockCard.styles";
import {
  createFadeInAnimation,
  createPressAnimation,
} from "../../utils/animations";

interface StockCardProps {
  stock: Stock;
  onPress: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onPress }) => {
  const { colors } = useTheme();
  const styles = stockCardStyles(colors);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animation functions
  const pressAnimations = createPressAnimation(scaleAnim);

  useEffect(() => {
    // Entrance animation
    createFadeInAnimation(fadeAnim, 300).start();
  }, []);

  const handlePressIn = () => {
    pressAnimations.pressIn.start();
  };

  const handlePressOut = () => {
    pressAnimations.pressOut.start();
  };

  // Safely handle potentially undefined values
  const rawChangePercent = stock.changePercent || "0%";
  const percentValue = parseFloat(rawChangePercent.replace("%", "")) || 0;
  const changePercent = `${percentValue.toFixed(2)}%`;
  const change = stock.change || "0";
  const price = stock.price || "0";

  const isPositive = parseFloat(changePercent.replace("%", "")) >= 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.symbolContainer}>
            <StockLogo symbol={stock.symbol || ""} size={24} />
            <Text style={styles.symbol} numberOfLines={1}>
              {stock.symbol || "N/A"}
            </Text>
          </View>
          <Text
            style={[
              styles.changePercent,
              getPercentageChangeStyle(changePercent),
            ]}
          >
            {changePercent}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {/* {stock.name || 'Unknown Stock'} */}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>${parseFloat(price).toFixed(2)}</Text>
          <Text style={[styles.change, getPriceChangeStyle(change)]}>
            {isPositive ? "+" : ""}${parseFloat(change).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default StockCard;
