import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

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
import { COLORS, DIMENSIONS } from '../../constants';
import { alphaVantageApi } from '../../services/alphaVantageApi';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StockCard from '../../components/cards/StockCard';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [data, setData] = useState<TopGainersLosersResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const result = await alphaVantageApi.getTopGainersLosers();
      setData(result);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading data:', error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate('ProductScreen', {
      symbol: stock.symbol,
      name: stock.name,
    });
  };

  const handleViewAll = (type: 'gainers' | 'losers') => {
    if (!data) return;
    
    const title = type === 'gainers' ? 'Top Gainers' : 'Top Losers';
    navigation.navigate('ViewAllScreen', { type, title });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    try {
      const searchResult = await alphaVantageApi.searchSymbol(searchQuery.trim());
      
      if (searchResult.bestMatches && searchResult.bestMatches.length > 0) {
        const firstMatch = searchResult.bestMatches[0];
        navigation.navigate('ProductScreen', {
          symbol: firstMatch['1. symbol'],
          name: firstMatch['2. name'],
        });
      } else {
        Alert.alert('No Results', 'No stocks found for your search term');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search stocks');
    }
  };

  const renderStockCard = ({ item }: { item: Stock }) => (
    <StockCard stock={item} onPress={() => handleStockPress(item)} />
  );

  const renderSection = (title: string, stocks: Stock[], type: 'gainers' | 'losers') => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => handleViewAll(type)}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={stocks.slice(0, 4)} // Show only first 4 items
        renderItem={renderStockCard}
        keyExtractor={(item, index) => `${type}-${item.symbol}-${index}`}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );

  if (loadingState.isLoading) {
    return <LoadingSpinner message="Loading market data..." />;
  }

  if (loadingState.error) {
    return <ErrorMessage message={loadingState.error} onRetry={loadData} />;
  }

  if (!data) {
    return <ErrorMessage message="No data available" onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <FlatList
        data={[1]} // Dummy data for single item
        renderItem={() => (
          <View>
            {renderSection('Top Gainers', data.top_gainers, 'gainers')}
            {renderSection('Top Losers', data.top_losers, 'losers')}
          </View>
        )}
        keyExtractor={() => 'sections'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
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
  searchContainer: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.borderRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  section: {
    marginBottom: DIMENSIONS.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.padding,
    paddingVertical: DIMENSIONS.padding / 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  gridContainer: {
    paddingHorizontal: DIMENSIONS.padding / 2,
  },
});

export default ExploreScreen;