import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { DIMENSIONS } from "../../constants";
import { ShimmerCard, ShimmerList } from "./ShimmerLoader";
import AnimatedHeader from "./AnimatedHeader";

// Product Screen Skeleton
export const ProductScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoAndTitleRow}>
          <ShimmerCard width={60} height={60} borderRadius={30} />
          <View style={styles.titleSection}>
            <ShimmerCard width="70%" height={24} />
            <ShimmerCard width="50%" height={16} />
          </View>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <ShimmerCard width="40%" height={32} />
        <ShimmerCard width="30%" height={20} />
      </View>

      {/* Tags Section */}
      <View style={styles.tagsSection}>
        <View style={styles.tagsRow}>
          <ShimmerCard width={80} height={28} borderRadius={14} />
          <ShimmerCard width={100} height={28} borderRadius={14} />
          <ShimmerCard width={90} height={28} borderRadius={14} />
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <ShimmerCard width="100%" height={200} />
      </View>

      {/* Metrics Section */}
      <View style={styles.metricsSection}>
        <ShimmerCard width="30%" height={20} />
        <View style={styles.metricsGrid}>
          <ShimmerCard width="48%" height={80} />
          <ShimmerCard width="48%" height={80} />
          <ShimmerCard width="48%" height={80} />
          <ShimmerCard width="48%" height={80} />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <ShimmerCard width="20%" height={20} />
        <ShimmerCard width="100%" height={16} />
        <ShimmerCard width="100%" height={16} />
        <ShimmerCard width="80%" height={16} />
      </View>
    </View>
  );
};

// Search Screen Skeleton
export const SearchScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Search Stocks" subtitle="Find stocks and ETFs" />

      {/* Search Input Skeleton */}
      <View style={styles.searchSection}>
        <ShimmerCard width="100%" height={50} borderRadius={25} />
      </View>

      {/* Search Results Skeleton */}
      <View style={styles.searchResults}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.searchResultItem}>
            <ShimmerCard width={40} height={40} borderRadius={20} />
            <View style={styles.searchResultContent}>
              <ShimmerCard width="60%" height={18} />
              <ShimmerCard width="80%" height={14} />
              <ShimmerCard width="40%" height={12} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Search Results Content Skeleton (for use within search screen)
export const SearchResultsSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.searchResults}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.searchResultItem}>
          <ShimmerCard width={40} height={40} borderRadius={20} />
          <View style={styles.searchResultContent}>
            <ShimmerCard width="60%" height={18} />
            <ShimmerCard width="80%" height={14} />
            <ShimmerCard width="40%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
};

// Watchlist Screen Skeleton
export const WatchlistScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Watchlists" subtitle="Your saved watchlists" />

      {/* Watchlist Items */}
      <View style={styles.watchlistContent}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.watchlistItem}>
            <View style={styles.watchlistInfo}>
              <ShimmerCard width="60%" height={20} />
              <ShimmerCard width="40%" height={14} />
              <ShimmerCard width="50%" height={12} />
            </View>
            <ShimmerCard width={24} height={24} borderRadius={12} />
          </View>
        ))}
      </View>
    </View>
  );
};

// ViewAll Screen Skeleton
export const ViewAllScreenSkeleton: React.FC<{ title?: string }> = ({
  title = "Loading...",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title={title}
        subtitle="Loading stocks..."
        showBackButton={true}
      />

      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        <ShimmerList count={8} />
      </View>
    </View>
  );
};

// Individual Watchlist View Skeleton
export const WatchlistDetailSkeleton: React.FC<{ name?: string }> = ({
  name = "Loading...",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title={name}
        subtitle="Loading stocks..."
        showBackButton={true}
      />

      {/* Stock Grid */}
      <View style={styles.gridContainer}>
        <ShimmerList count={6} />
      </View>
    </View>
  );
};

// Compact skeleton for loading more items in lists
export const LoadMoreSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.loadMoreContainer}>
      <ShimmerList count={2} />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerSection: {
      padding: DIMENSIONS.padding,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoAndTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    titleSection: {
      marginLeft: DIMENSIONS.padding,
      flex: 1,
      gap: 8,
    },
    priceSection: {
      padding: DIMENSIONS.padding,
      gap: 8,
    },
    tagsSection: {
      paddingHorizontal: DIMENSIONS.padding,
      paddingBottom: DIMENSIONS.padding,
    },
    tagsRow: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    chartSection: {
      padding: DIMENSIONS.padding,
    },
    metricsSection: {
      padding: DIMENSIONS.padding,
      gap: 12,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 8,
    },
    aboutSection: {
      padding: DIMENSIONS.padding,
      gap: 8,
    },
    searchSection: {
      padding: DIMENSIONS.padding,
    },
    searchResults: {
      flex: 1,
      paddingHorizontal: DIMENSIONS.padding,
    },
    searchResultItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: DIMENSIONS.padding,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchResultContent: {
      marginLeft: DIMENSIONS.padding,
      flex: 1,
      gap: 6,
    },
    watchlistContent: {
      flex: 1,
      padding: DIMENSIONS.padding,
    },
    watchlistItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: DIMENSIONS.padding,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    watchlistInfo: {
      flex: 1,
      gap: 6,
    },
    gridContainer: {
      flex: 1,
      padding: DIMENSIONS.padding / 2,
    },
    loadMoreContainer: {
      padding: DIMENSIONS.padding,
    },
  });
