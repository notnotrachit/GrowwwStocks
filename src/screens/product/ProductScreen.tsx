import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
import { COLORS, DIMENSIONS } from '../../constants';
import { alphaVantageApi } from '../../services/alphaVantageApi';
import { watchlistService } from '../../services/watchlistService';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StockChart from '../../components/charts/StockChart';
import AddToWatchlistModal from '../../components/modals/AddToWatchlistModal';
import { isCompanyDataEmpty, hasMinimalCompanyData } from '../../utils/companyDataValidator';

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
    if (isInWatchlist) {
      handleRemoveFromWatchlist();
    } else {
      setShowAddToWatchlist(true);
    }
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

    const latestDate = Object.keys(chartData['Time Series (Daily)'])[0];
    const latestData = chartData['Time Series (Daily)'][latestDate];
    const previousDate = Object.keys(chartData['Time Series (Daily)'])[1];
    const previousData = chartData['Time Series (Daily)'][previousDate];

    const currentPrice = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(previousData['4. close']);
    const change = currentPrice - previousPrice;
    const changePercent = ((change / previousPrice) * 100).toFixed(2);

    return {
      symbol: companyData.Symbol,
      name: companyData.Name,
      price: currentPrice.toString(),
      change: change.toString(),
      changePercent: `${changePercent}%`,
      volume: latestData['5. volume'],
    };
  };

  const formatValue = (value: string | undefined, prefix = '', suffix = '') => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    return `${prefix}${value}${suffix}`;
  };

  const formatMarketCap = (value: string) => {
    if (!value || value === 'None') return 'N/A';
    const num = parseFloat(value);
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
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
        {/* Chart Section */}
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
            {/* Key Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Information</Text>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Market Cap</Text>
                  <Text style={styles.infoValue}>
                    {formatMarketCap(companyData.MarketCapitalization)}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>P/E Ratio</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData.PERatio)}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>EPS</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData.EPS, '$')}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Beta</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData.Beta)}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>52W High</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData['52WeekHigh'], '$')}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>52W Low</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData['52WeekLow'], '$')}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Revenue TTM</Text>
                  <Text style={styles.infoValue}>
                    {formatMarketCap(companyData.RevenueTTM)}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Profit Margin</Text>
                  <Text style={styles.infoValue}>
                    {formatValue(companyData.ProfitMargin) !== 'N/A' 
                      ? `${(parseFloat(companyData.ProfitMargin || '0') * 100).toFixed(2)}%`
                      : 'N/A'
                    }
                  </Text>
                </View>
              </View>
            </View>

            {/* Company Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company Overview</Text>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Sector</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.Sector)}
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Industry</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.Industry)}
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Exchange</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.Exchange)}
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Country</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.Country)}
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Currency</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.Currency)}
                </Text>
              </View>
              
              <View style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>Fiscal Year End</Text>
                <Text style={styles.overviewValue}>
                  {formatValue(companyData.FiscalYearEnd)}
                </Text>
              </View>

              {companyData.Description && companyData.Description !== 'None' && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.overviewLabel}>Description</Text>
                  <Text style={styles.description}>
                    {companyData.Description}
                  </Text>
                </View>
              )}
              
              {companyData.OfficialSite && companyData.OfficialSite !== 'None' && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.overviewLabel}>Official Website</Text>
                  <Text style={[styles.description, styles.websiteLink]}>
                    {companyData.OfficialSite}
                  </Text>
                </View>
              )}
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    marginRight: DIMENSIONS.padding,
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: DIMENSIONS.margin,
    padding: DIMENSIONS.padding,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.margin,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: DIMENSIONS.margin,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  overviewLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    flex: 1,
  },
  overviewValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  descriptionContainer: {
    marginTop: DIMENSIONS.margin,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noDataMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  websiteLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default ProductScreen;