import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, Watchlist, Stock } from "../../types";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { watchlistService } from "../../services/watchlistService";

import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StockCard from "../../components/cards/StockCard";
import AnimatedHeader from "../../components/common/AnimatedHeader";
import FloatingActionButton from "../../components/common/FloatingActionButton";
import {
  WatchlistScreenSkeleton,
  WatchlistDetailSkeleton,
} from "../../components/common/SkeletonLayouts";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const WatchlistScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadWatchlists();
    }, [])
  );

  const loadWatchlists = async () => {
    try {
      setIsLoading(true);
      const lists = await watchlistService.getWatchlists();
      setWatchlists(lists);

      // If a watchlist was selected and still exists, keep it selected
      if (selectedWatchlist) {
        const updatedWatchlist = lists.find(
          (w) => w.id === selectedWatchlist.id
        );
        setSelectedWatchlist(updatedWatchlist || null);
      }
    } catch (error) {
      console.error("Error loading watchlists:", error);
      Alert.alert("Error", "Failed to load watchlists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWatchlists();
    setRefreshing(false);
  };

  const handleWatchlistPress = (watchlist: Watchlist) => {
    setSelectedWatchlist(watchlist);
  };

  const handleBackToWatchlists = () => {
    setSelectedWatchlist(null);
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate("ProductScreen", {
      symbol: stock.symbol,
      name: stock.name,
    });
  };

  const handleDeleteWatchlist = (watchlist: Watchlist) => {
    Alert.alert(
      "Delete Watchlist",
      `Are you sure you want to delete "${watchlist.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await watchlistService.deleteWatchlist(watchlist.id);
              await loadWatchlists();
              if (selectedWatchlist?.id === watchlist.id) {
                setSelectedWatchlist(null);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete watchlist");
            }
          },
        },
      ]
    );
  };

  const handleRemoveStock = (stock: Stock) => {
    if (!selectedWatchlist) return;

    Alert.alert(
      "Remove Stock",
      `Remove ${stock.symbol} from ${selectedWatchlist.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await watchlistService.removeStockFromWatchlist(
                selectedWatchlist.id,
                stock.symbol
              );
              await loadWatchlists();
            } catch (error) {
              Alert.alert("Error", "Failed to remove stock");
            }
          },
        },
      ]
    );
  };

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={styles(colors).watchlistItem}
      onPress={() => handleWatchlistPress(item)}
    >
      <View style={styles(colors).watchlistInfo}>
        <Text style={styles(colors).watchlistName}>{item.name}</Text>
        <Text style={styles(colors).stockCount}>
          {item.stocks.length} stock{item.stocks.length !== 1 ? "s" : ""}
        </Text>
        <Text style={styles(colors).lastUpdated}>
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles(colors).watchlistActions}>
        <TouchableOpacity
          style={styles(colors).deleteButton}
          onPress={() => handleDeleteWatchlist(item)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>

        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  const renderStockItem = ({ item }: { item: Stock }) => (
    <View style={styles(colors).stockItemContainer}>
      <StockCard stock={item} onPress={() => handleStockPress(item)} />
      <TouchableOpacity
        style={styles(colors).removeStockButton}
        onPress={() => handleRemoveStock(item)}
      >
        <Ionicons name="close-circle" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return selectedWatchlist ? (
      <WatchlistDetailSkeleton name={selectedWatchlist.name} />
    ) : (
      <WatchlistScreenSkeleton />
    );
  }

  // Show individual watchlist view
  if (selectedWatchlist) {
    return (
      <View style={styles(colors).container}>
        <AnimatedHeader
          title={selectedWatchlist.name}
          subtitle={`${selectedWatchlist.stocks.length} stock${
            selectedWatchlist.stocks.length !== 1 ? "s" : ""
          }`}
          showBackButton={true}
          onBackPress={handleBackToWatchlists}
        />

        {selectedWatchlist.stocks.length > 0 ? (
          <FlatList
            data={selectedWatchlist.stocks}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.symbol}
            numColumns={2}
            contentContainerStyle={styles(colors).stocksList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
          />
        ) : (
          <EmptyState
            icon="bookmark-outline"
            title="No Stocks"
            message="This watchlist is empty. Add stocks from the Explore tab."
          />
        )}
      </View>
    );
  }

  // Show watchlists overview
  return (
    <View style={styles(colors).container}>
      <AnimatedHeader
        title="Watchlists"
        subtitle={`${watchlists.length} watchlist${
          watchlists.length !== 1 ? "s" : ""
        }`}
      />

      {watchlists.length > 0 ? (
        <FlatList
          data={watchlists}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles(colors).watchlistsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <EmptyState
          icon="bookmark-outline"
          title="No Watchlists"
          message="Create your first watchlist by adding stocks from the Explore tab."
        />
      )}
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: DIMENSIONS.padding,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },
    placeholder: {
      width: 32,
    },
    watchlistsList: {
      padding: DIMENSIONS.padding,
    },
    watchlistItem: {
      backgroundColor: colors.surface,
      borderRadius: DIMENSIONS.borderRadius,
      padding: DIMENSIONS.padding,
      marginBottom: DIMENSIONS.margin,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: DIMENSIONS.cardElevation,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: DIMENSIONS.cardElevation,
    },
    watchlistInfo: {
      flex: 1,
    },
    watchlistName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    stockCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    lastUpdated: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    watchlistActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    deleteButton: {
      padding: 8,
      marginRight: 8,
    },
    stocksList: {
      padding: DIMENSIONS.padding / 2,
    },
    stockItemContainer: {
      position: "relative",
      flex: 1,
    },
    removeStockButton: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: colors.surface,
      borderRadius: 12,
      zIndex: 1,
    },
  });

export default WatchlistScreen;
