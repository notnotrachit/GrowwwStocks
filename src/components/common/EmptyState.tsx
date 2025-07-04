import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
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
    title: {
      marginTop: DIMENSIONS.margin,
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    message: {
      marginTop: DIMENSIONS.margin / 2,
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

export default EmptyState;
