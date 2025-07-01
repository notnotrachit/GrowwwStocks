import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DIMENSIONS } from "../../constants";
import useTheme from "../../hooks/useTheme";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  size?: "small" | "medium" | "large";
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend = "neutral",
  size = "medium",
}) => {
  const { colors } = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return colors.success;
      case "down":
        return colors.error;
      default:
        return colors.text;
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          styles[`${size}Value`],
          { color: getTrendColor() },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: DIMENSIONS.padding / 2,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Sizes
    small: {
      minHeight: 60,
    },
    medium: {
      minHeight: 70,
    },
    large: {
      minHeight: 80,
    },

    label: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 4,
    },

    value: {
      fontWeight: "bold",
      flexShrink: 1,
    },

    // Value sizes
    smallValue: {
      fontSize: 14,
    },
    mediumValue: {
      fontSize: 16,
    },
    largeValue: {
      fontSize: 18,
    },
  });

export default MetricCard;
