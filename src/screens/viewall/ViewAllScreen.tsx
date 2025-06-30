import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList, Stock, LoadingState } from '../../types';

type TopGainersLosersResponse = {
  top_gainers: Stock[];
  top_losers: Stock[];
  most_actively_traded: Stock[];
  metadata: {
    information: string;
    last_updated: string;
  };
};
import { COLORS, DIMENSIONS, DEFAULT_VALUES } from '../../constants';
import { alphaVantageApi } from '../../services/alphaVantageApi';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StockCard from '../../components/cards/StockCard';

type ViewAllScreenRouteProp = RouteProp<RootStackParamList, 'ViewAllScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ViewAllScreen: React.FC = () => {
  const route = useRoute<ViewAllScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { type, title } = route.params;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async (page = 1) => {
    try {
      if (page === 1) {
        setLoadingState({ isLoading: true, error: null });
      } else {
        setIsLoadingMore(true);
      }

      const result = await alphaVantageApi.getTopGainersLosers();
      const newStocks = type === 'gainers' ? result.top_gainers : result.top_losers;
      
      if (page === 1) {
        setStocks(newStocks);
        setCurrentPage(1);
      } else {
        // For pagination simulation, we'll just show the same data
        // In a real app, you'd have actual pagination from the API
        setStocks(prev => [...prev, ...newStocks]);
      }

      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading data:', error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && stocks.length >= DEFAULT_VALUES.ITEMS_PER_PAGE) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadData(nextPage);
    }
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate('ProductScreen', {
      symbol: stock.symbol,
      name: stock.name,
    });
  };

  const renderStockCard = ({ item }: { item: Stock }) => (
    <StockCard stock={item} onPress={() => handleStockPress(item)} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" message="Loading more..." />
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: 140, // Approximate height of StockCard + margins
    offset: 140 * Math.floor(index / 2), // Two columns
    index,
  });

  if (loadingState.isLoading) {
    return <LoadingSpinner message={`Loading ${title.toLowerCase()}...`} />;
  }

  if (loadingState.error) {
    return <ErrorMessage message={loadingState.error} onRetry={() => loadData(1)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stocks}
        renderItem={renderStockCard}
        keyExtractor={(item, index) => `${item.symbol}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: DIMENSIONS.padding / 2,
  },
  footerLoader: {
    paddingVertical: DIMENSIONS.padding,
    alignItems: 'center',
  },
});

export default ViewAllScreen;