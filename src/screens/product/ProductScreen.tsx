import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { 
  RootStackParamList, 
  CompanyOverview, 
  StockTimeSeries, 
  LoadingState,
  Stock 
} from '../../types';
import { productScreenStyles as styles } from '../../styles/screens/ProductScreen.styles';
import { COLORS } from '../../constants';
import { alphaVantageApi } from '../../services/alphaVantageApi';
import { watchlistService } from '../../services/watchlistService';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StockChart from '../../components/charts/StockChart';
import AddToWatchlistModal from '../../components/modals/AddToWatchlistModal';
import { isCompanyDataEmpty, hasMinimalCompanyData } from '../../utils/companyDataValidator';
import { getAvailableMetrics, getAvailableCompanyInfo, hasValue } from '../../utils/stockDataHelpers';

type ProductScreenRouteProp = RouteProp<RootStackParamList, 'ProductScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProductScreen: React.FC = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { symbol, name } = route.params;

  const [companyData, setCompanyData] = useState<CompanyOverview | null>(null);
  const [chartData, setChartData] = useState<StockTimeSeries | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);

  useEffect(() => {
    loadData();
    checkWatchlistStatus();
  }, [symbol]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleWatchlistToggle}
        >
          <Ionicons
            name={isInWatchlist ? 'heart' : 'heart-outline'}
            size={24}
            color={isInWatchlist ? COLORS.error : COLORS.surface}
          />
        </TouchableOpacity>
      ),
    });
  }, [isInWatchlist]);

  const loadData = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      
      const [companyResult, chartResult] = await Promise.all([
        alphaVantageApi.getCompanyOverview(symbol),
        alphaVantageApi.getTimeSeriesDaily(symbol),
      ]);

      setCompanyData(companyResult);
      setChartData(chartResult);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading data:', error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const inWatchlist = await watchlistService.isStockInAnyWatchlist(symbol);
      setIsInWatchlist(inWatchlist);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const handleWatchlistToggle = () => {
    setShowAddToWatchlist(true);
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      const watchlists = await watchlistService.getWatchlistsContainingStock(symbol);
      
      if (watchlists.length === 1) {
        await watchlistService.removeStockFromWatchlist(watchlists[0].id, symbol);
        setIsInWatchlist(false);
        Alert.alert('Success', `Removed ${symbol} from ${watchlists[0].name}`);
      } else if (watchlists.length > 1) {
        // Show selection if stock is in multiple watchlists
        const watchlistNames = watchlists.map(w => w.name);
        Alert.alert(
          'Remove from Watchlist',
          `${symbol} is in multiple watchlists: ${watchlistNames.join(', ')}. Please remove manually from the Watchlist tab.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from watchlist');
    }
  };

  const handleAddToWatchlistSuccess = () => {
    setIsInWatchlist(true);
  };

  const createStockObject = (): Stock | null => {
    if (!companyData || !chartData) return null;

    const dates = Object.keys(chartData['Time Series (Daily)']).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (dates.length < 1) return null;

    const latestDate = dates[0];
    const latestData = chartData['Time Series (Daily)'][latestDate];
    const currentPrice = parseFloat(latestData['4. close']);

    return {
      symbol: companyData.Symbol,
      name: companyData.Name,
      price: currentPrice.toString(),
      volume: latestData['5. volume'],
    };
  };


  if (loadingState.isLoading) {
    return <LoadingSpinner message="Loading stock details..." />;
  }

  if (loadingState.error) {
    return <ErrorMessage message={loadingState.error} onRetry={loadData} />;
  }

  if (!chartData) {
    return <ErrorMessage message="No chart data available" onRetry={loadData} />;
  }

  const stock = createStockObject();
  const hasCompanyData = companyData && hasMinimalCompanyData(companyData);
  const isDataEmpty = companyData && isCompanyDataEmpty(companyData);

  const renderNoDataMessage = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Company Information</Text>
      <View style={styles.noDataContainer}>
        <Ionicons name="information-circle-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.noDataTitle}>No Details Available</Text>
        <Text style={styles.noDataMessage}>
          Company details are not available for this stock right now.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Price Section */}
        {stock && (
          <View style={styles.priceSection}>
            <View style={styles.priceHeader}>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockName}>{stock.name}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.currentPrice}>${parseFloat(stock.price).toFixed(4)}</Text>
            </View>
            <Text style={styles.lastUpdated}>
              Volume: {parseInt(stock.volume).toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.chartContainer}>
          <StockChart 
            data={chartData['Time Series (Daily)']} 
            symbol={symbol} 
          />
        </View>

        {/* Conditional Company Information */}
        {!hasCompanyData || isDataEmpty ? (
          renderNoDataMessage()
        ) : (
          <>
            {(() => {
              const metrics = getAvailableMetrics(companyData);
              if (metrics.length === 0) return null;
              
              return (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Financial Metrics</Text>
                  <View style={styles.infoGrid}>
                    {metrics.map((metric, index) => (
                      <View key={index} style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{metric.label}</Text>
                        <Text style={styles.infoValue}>{metric.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })()}

            {(() => {
              const companyInfo = getAvailableCompanyInfo(companyData);
              if (companyInfo.length === 0) return null;
              
              return (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Company Information</Text>
                  {companyInfo.map((info, index) => (
                    <View key={index} style={styles.overviewItem}>
                      <Text style={styles.overviewLabel}>{info.label}</Text>
                      <Text style={styles.overviewValue}>{info.value}</Text>
                    </View>
                  ))}
                </View>
              );
            })()}

            {hasValue(companyData.Description) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>
                  {companyData.Description}
                </Text>
              </View>
            )}
            
            {hasValue(companyData.OfficialSite) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Website</Text>
                <Text style={[styles.description, styles.websiteLink]}>
                  {companyData.OfficialSite}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <AddToWatchlistModal
        isVisible={showAddToWatchlist}
        onClose={() => setShowAddToWatchlist(false)}
        stock={stock}
        onSuccess={handleAddToWatchlistSuccess}
      />
    </View>
  );
};

export default ProductScreen;