import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, FlatList } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { DIMENSIONS } from "../../constants";
import { createShimmerAnimation } from "../../utils/animations";

interface ShimmerCardProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
}

const ShimmerCard: React.FC<ShimmerCardProps> = ({
  height = 120,
  width = "100%",
  borderRadius = DIMENSIONS.borderRadius,
}) => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    createShimmerAnimation(shimmerAnim).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width,
          borderRadius,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: colors.textSecondary,
            transform: [{ translateX }],
            opacity,
          },
        ]}
      />

      {/* Content placeholder */}
      <View style={styles.content}>
        <View
          style={[
            styles.placeholder,
            { backgroundColor: colors.border, width: "60%", height: 16 },
          ]}
        />
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: colors.border,
              width: "40%",
              height: 12,
              marginTop: 8,
            },
          ]}
        />
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: colors.border,
              width: "80%",
              height: 20,
              marginTop: 16,
            },
          ]}
        />
      </View>
    </View>
  );
};

const ShimmerList: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const data = Array.from({ length: count }, (_, index) => ({ id: index }));

  const renderShimmerItem = ({ item }: { item: { id: number } }) => (
    <View style={styles.shimmerCard}>
      <ShimmerCard />
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderShimmerItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  content: {
    padding: DIMENSIONS.padding,
    flex: 1,
  },
  placeholder: {
    borderRadius: 4,
  },
  list: {},
  shimmerCard: {
    flex: 1,
    marginHorizontal: DIMENSIONS.padding / 4,
    marginBottom: DIMENSIONS.margin,
  },
});

export { ShimmerCard, ShimmerList };
