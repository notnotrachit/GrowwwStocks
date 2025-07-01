import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

interface TagProps {
  label: string;
  value: string;
  variant?: "default" | "outline" | "accent";
  size?: "small" | "medium";
}

const Tag: React.FC<TagProps> = ({
  label,
  value,
  variant = "default",
  size = "medium",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, styles[variant], styles[size]]}>
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      <Text style={[styles.value, styles[`${variant}Value`]]}>{value}</Text>
    </View>
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
