import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, Stock, LoadingState } from "../../types";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";

type TopGainersLosersResponse = {
  top_gainers: Stock[];
  top_losers: Stock[];
  most_actively_traded: Stock[];
  metadata: {
    information: string;
    last_updated: string;
  };
};
// import { COLORS, DIMENSIONS } from '../../constants';
import { alphaVantageApi } from "../../services/alphaVantageApi";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StockCard from "../../components/cards/StockCard";
import { ShimmerList } from "../../components/common/ShimmerLoader";
import AnimatedHeader from "../../components/common/AnimatedHeader";
import FloatingActionButton from "../../components/common/FloatingActionButton";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [data, setData] = useState<TopGainersLosersResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const result = await alphaVantageApi.getTopGainersLosers();
      setData(result);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error("Error loading data:", error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate("ProductScreen", {
      symbol: stock.symbol,
      name: stock.name,
    });
  };

  const handleViewAll = (type: "gainers" | "losers") => {
    if (!data) return;

    const title = type === "gainers" ? "Top Gainers" : "Top Losers";
    navigation.navigate("ViewAllScreen", { type, title });
  };

  const renderStockCard = ({ item }: { item: Stock }) => (
    <StockCard stock={item} onPress={() => handleStockPress(item)} />
  );

  const renderSection = (
    title: string,
    stocks: Stock[],
    type: "gainers" | "losers"
  ) => (
    <View style={styles(colors).section}>
      <View style={styles(colors).sectionHeader}>
        <Text style={styles(colors).sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => handleViewAll(type)}>
          <Text style={styles(colors).viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stocks.slice(0, 4)} // Show only first 4 items
        renderItem={renderStockCard}
        keyExtractor={(item, index) => `${type}-${item.symbol}-${index}`}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles(colors).gridContainer}
      />
    </View>
  );

  if (loadingState.isLoading) {
    return (
      <View style={styles(colors).container}>
        <AnimatedHeader
          title="Explore Stocks"
          rightComponent={
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchScreen")}
            >
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />

        <FlatList
          data={[1]}
          renderItem={() => (
            <View>
              <View style={styles(colors).section}>
                <View style={styles(colors).sectionHeader}>
                  <Text style={styles(colors).sectionTitle}>Top Gainers</Text>
                  <TouchableOpacity onPress={() => handleViewAll("gainers")}>
                    <Text style={styles(colors).viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles(colors).gridContainer}>
                  <ShimmerList count={4} />
                </View>
              </View>

              <View style={styles(colors).section}>
                <View style={styles(colors).sectionHeader}>
                  <Text style={styles(colors).sectionTitle}>Top Losers</Text>
                  <TouchableOpacity onPress={() => handleViewAll("losers")}>
                    <Text style={styles(colors).viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles(colors).gridContainer}>
                  <ShimmerList count={4} />
                </View>
              </View>
            </View>
          )}
          keyExtractor={() => "sections"}
          showsVerticalScrollIndicator={false}
        />

        <FloatingActionButton
          icon="search"
          onPress={() => navigation.navigate("SearchScreen")}
        />
      </View>
    );
  }

  if (loadingState.error) {
    return <ErrorMessage message={loadingState.error} onRetry={loadData} />;
  }

  if (!data) {
    return <ErrorMessage message="No data available" onRetry={loadData} />;
  }

  return (
    <View style={styles(colors).container}>
      <AnimatedHeader
        title="Explore Stocks"
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={[1]}
        renderItem={() => (
          <View>
            {renderSection("Top Gainers", data.top_gainers, "gainers")}
            {renderSection("Top Losers", data.top_losers, "losers")}
          </View>
        )}
        keyExtractor={() => "sections"}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton
        icon="search"
        onPress={() => navigation.navigate("SearchScreen")}
      />
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: DIMENSIONS.margin,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: DIMENSIONS.padding,
      paddingVertical: DIMENSIONS.padding / 2,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    viewAllText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "500",
    },
    gridContainer: {
      paddingHorizontal: DIMENSIONS.padding / 2,
    },
  });

export default ExploreScreen;
