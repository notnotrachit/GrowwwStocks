import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: DIMENSIONS.padding,
    },
    message: {
      marginTop: DIMENSIONS.margin,
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

export default LoadingSpinner;
