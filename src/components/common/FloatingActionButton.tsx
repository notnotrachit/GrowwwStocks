import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import {
  createScaleAnimation,
  createPulseAnimation,
} from "../../utils/animations";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  pulse?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  size = 24,
  color,
  backgroundColor,
  pulse = false,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pulse) {
      createPulseAnimation(pulseAnim).start();
    }
  }, [pulse]);

  const handlePressIn = () => {
    createScaleAnimation(scaleAnim, 0.9, 150).start();
  };

  const handlePressOut = () => {
    createScaleAnimation(scaleAnim, 1, 150).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || colors.primary,
          transform: [{ scale: scaleAnim }, { scale: pulse ? pulseAnim : 1 }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={size} color={color || colors.surface} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingActionButton;
