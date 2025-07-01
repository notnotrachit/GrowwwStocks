import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { DIMENSIONS } from "../../constants";
import {
  createFadeInAnimation,
  createSlideInAnimation,
} from "../../utils/animations";

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  backgroundColor?: string;
  showBackButton?: boolean;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  onBackPress,
  backgroundColor,
  showBackButton = false,
}) => {
  const { colors } = useTheme();
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      createFadeInAnimation(titleAnim, 300),
      subtitle ? createFadeInAnimation(subtitleAnim, 300, 100) : null,
      rightComponent ? createFadeInAnimation(rightAnim, 300, 200) : null,
    ].filter(Boolean);

    animations.forEach((anim) => anim?.start());
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || colors.primary,
        },
      ]}
    >
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Animated.Text
            style={[styles.title, { color: "#FFFFFF", opacity: titleAnim }]}
            numberOfLines={1}
          >
            {title}
          </Animated.Text>

          {subtitle && (
            <Animated.Text
              style={[
                styles.subtitle,
                { color: "#FFFFFF", opacity: subtitleAnim },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Animated.Text>
          )}
        </View>

        {rightComponent && (
          <Animated.View
            style={[styles.rightComponent, { opacity: rightAnim }]}
          >
            {rightComponent}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40, // Status bar height
    paddingBottom: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DIMENSIONS.padding,
    minHeight: 56,
  },
  backButton: {
    marginRight: DIMENSIONS.padding,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.9,
  },
  rightComponent: {
    marginLeft: DIMENSIONS.padding,
  },
});

export default AnimatedHeader;
