import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
      marginBottom: DIMENSIONS.margin,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: DIMENSIONS.borderRadius,
    },
    retryText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default ErrorMessage;
