import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, Stock, LoadingState } from "../../types";

type TopGainersLosersResponse = {
  top_gainers: Stock[];
  top_losers: Stock[];
  most_actively_traded: Stock[];
  metadata: {
    information: string;
    last_updated: string;
  };
};
import { DIMENSIONS, DEFAULT_VALUES } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { alphaVantageApi } from "../../services/alphaVantageApi";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StockCard from "../../components/cards/StockCard";
import AnimatedHeader from "../../components/common/AnimatedHeader";
import {
  ViewAllScreenSkeleton,
  LoadMoreSkeleton,
} from "../../components/common/SkeletonLayouts";

type ViewAllScreenRouteProp = RouteProp<RootStackParamList, "ViewAllScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ViewAllScreen: React.FC = () => {
  const route = useRoute<ViewAllScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { type, title } = route.params;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });

      const result = await alphaVantageApi.getTopGainersLosers();
      const newStocks =
        type === "gainers" ? result.top_gainers : result.top_losers;
      
      setAllStocks(newStocks);
      setCurrentPage(1);
      setStocks(newStocks.slice(0, DEFAULT_VALUES.ITEMS_PER_PAGE));
      setHasMoreData(newStocks.length > DEFAULT_VALUES.ITEMS_PER_PAGE);

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

  const handleLoadMore = () => {
    console.log('handleLoadMore called', { 
      isLoadingMore, 
      hasMoreData, 
      currentStocksLength: stocks.length, 
      allStocksLength: allStocks.length,
      currentPage 
    });
    
    if (!isLoadingMore && hasMoreData) {
      setIsLoadingMore(true);
      
      setTimeout(() => {
        const nextPage = currentPage + 1;
        const startIndex = currentPage * DEFAULT_VALUES.ITEMS_PER_PAGE; // Fix: use currentPage, not nextPage-1
        const endIndex = startIndex + DEFAULT_VALUES.ITEMS_PER_PAGE;
        const nextBatch = allStocks.slice(startIndex, endIndex);
        
        console.log('Loading more data', { 
          nextPage, 
          startIndex, 
          endIndex, 
          nextBatchLength: nextBatch.length 
        });
        
        if (nextBatch.length > 0) {
          setStocks(prev => [...prev, ...nextBatch]);
          setCurrentPage(nextPage);
          setHasMoreData(endIndex < allStocks.length);
        } else {
          setHasMoreData(false);
        }
        
        setIsLoadingMore(false);
      }, 500);
    }
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate("ProductScreen", {
      symbol: stock.symbol,
      name: stock.name,
    });
  };

  const renderStockCard = ({ item }: { item: Stock }) => (
    <StockCard stock={item} onPress={() => handleStockPress(item)} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return <LoadMoreSkeleton />;
  };

  const getItemLayout = (_: any, index: number) => ({
    length: 140, // Approximate height of StockCard + margins
    offset: 140 * Math.floor(index / 2), // Two columns
    index,
  });

  if (loadingState.isLoading) {
    return <ViewAllScreenSkeleton title={title} />;
  }

  if (loadingState.error) {
    return (
      <ErrorMessage message={loadingState.error} onRetry={loadData} />
    );
  }

  return (
    <View style={createStyles(colors).container}>
      <AnimatedHeader
        title={title}
        subtitle={`${stocks.length} stocks`}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <FlatList
        key="viewall-stocks"
        data={stocks}
        renderItem={renderStockCard}
        keyExtractor={(item, index) => `${item.symbol}-${index}`}
        numColumns={2}
        contentContainerStyle={createStyles(colors).listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={false}
        maxToRenderPerBatch={20}
        windowSize={5}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: DIMENSIONS.padding / 2,
    },
    footerLoader: {
      paddingVertical: DIMENSIONS.padding,
      alignItems: "center",
    },
  });

export default ViewAllScreen;
