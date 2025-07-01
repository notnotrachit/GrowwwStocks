import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import useTheme from "../../hooks/useTheme";
import {
  createFadeInAnimation,
  createScaleAnimation,
} from "../../utils/animations";

interface TagProps {
  label: string;
  value: string;
  variant?: "default" | "outline" | "accent";
  size?: "small" | "medium";
  delay?: number;
}

const Tag: React.FC<TagProps> = ({
  label,
  value,
  variant = "default",
  size = "medium",
  delay = 0,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    createFadeInAnimation(fadeAnim, 400, delay).start();
    createScaleAnimation(scaleAnim, 1, 400).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.container,
        styles[variant],
        styles[size],
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      <Text style={[styles.value, styles[`${variant}Value`]]}>{value}</Text>
    </Animated.View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    },

    // Variants
    default: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.textSecondary,
    },
    accent: {
      backgroundColor: `${colors.primary}15`,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },

    // Sizes
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },

    // Text styles
    label: {
      fontSize: 12,
      fontWeight: "500",
      marginRight: 4,
    },
    value: {
      fontSize: 12,
      fontWeight: "600",
    },

    // Variant text styles
    defaultLabel: {
      color: colors.textSecondary,
    },
    defaultValue: {
      color: colors.text,
    },
    outlineLabel: {
      color: colors.textSecondary,
    },
    outlineValue: {
      color: colors.text,
    },
    accentLabel: {
      color: colors.primary,
    },
    accentValue: {
      color: colors.primary,
    },
  });

export default Tag;
