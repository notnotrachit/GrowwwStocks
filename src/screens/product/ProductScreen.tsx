import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState as useLocalState } from "react";

import {
  RootStackParamList,
  CompanyOverview,
  StockTimeSeries,
  LoadingState,
  Stock,
} from "../../types";
import { productScreenStyles } from "../../styles/screens/ProductScreen.styles";
import useTheme from "../../hooks/useTheme";
import { alphaVantageApi } from "../../services/alphaVantageApi";
import { watchlistService } from "../../services/watchlistService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StockChart from "../../components/charts/StockChart";
import AddToWatchlistModal from "../../components/modals/AddToWatchlistModal";
import StockLogo from "../../components/common/StockLogo";
import Tag from "../../components/common/Tag";
import MetricCard from "../../components/common/MetricCard";
import {
  isCompanyDataEmpty,
  hasMinimalCompanyData,
} from "../../utils/companyDataValidator";
import {
  getAvailableMetrics,
  getAvailableCompanyInfo,
  getCompanyTags,
  hasValue,
} from "../../utils/stockDataHelpers";

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProductScreen: React.FC = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { symbol, name } = route.params;
  const { colors } = useTheme();
  const styles = productScreenStyles(colors);

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
            name={isInWatchlist ? "heart" : "heart-outline"}
            size={24}
            color={isInWatchlist ? colors.error : colors.surface}
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
      console.error("Error loading data:", error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      });
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const inWatchlist = await watchlistService.isStockInAnyWatchlist(symbol);
      setIsInWatchlist(inWatchlist);
    } catch (error) {
      console.error("Error checking watchlist status:", error);
    }
  };

  const handleWatchlistToggle = () => {
    setShowAddToWatchlist(true);
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      const watchlists = await watchlistService.getWatchlistsContainingStock(
        symbol
      );

      if (watchlists.length === 1) {
        await watchlistService.removeStockFromWatchlist(
          watchlists[0].id,
          symbol
        );
        setIsInWatchlist(false);
        Alert.alert("Success", `Removed ${symbol} from ${watchlists[0].name}`);
      } else if (watchlists.length > 1) {
        // Show selection if stock is in multiple watchlists
        const watchlistNames = watchlists.map((w) => w.name);
        Alert.alert(
          "Remove from Watchlist",
          `${symbol} is in multiple watchlists: ${watchlistNames.join(
            ", "
          )}. Please remove manually from the Watchlist tab.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to remove from watchlist");
    }
  };

  const handleAddToWatchlistSuccess = () => {
    setIsInWatchlist(true);
  };

  const createStockObject = (): Stock | null => {
    if (!companyData || !chartData) return null;

    const dates = Object.keys(chartData["Time Series (Daily)"]).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (dates.length < 1) return null;

    const latestDate = dates[0];
    const latestData = chartData["Time Series (Daily)"][latestDate];
    const currentPrice = parseFloat(latestData["4. close"]);

    return {
      symbol: companyData.Symbol,
      name: companyData.Name,
      price: currentPrice.toString(),
      volume: latestData["5. volume"],
      change: (currentPrice - parseFloat(latestData["1. open"])).toFixed(2),
      changePercent:
        (
          ((currentPrice - parseFloat(latestData["1. open"])) /
            parseFloat(latestData["1. open"])) *
          100
        ).toFixed(2) + "%",
    };
  };

  if (loadingState.isLoading) {
    return <LoadingSpinner message="Loading stock details..." />;
  }

  if (loadingState.error) {
    return <ErrorMessage message={loadingState.error} onRetry={loadData} />;
  }

  if (!chartData) {
    return (
      <ErrorMessage message="No chart data available" onRetry={loadData} />
    );
  }

  const stock = createStockObject();
  const hasCompanyData = companyData && hasMinimalCompanyData(companyData);
  const isDataEmpty = companyData && isCompanyDataEmpty(companyData);

  const renderNoDataMessage = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Company Information</Text>
      <View style={styles.noDataContainer}>
        <Ionicons
          name="information-circle-outline"
          size={52}
          color={colors.textSecondary}
        />
        <Text style={styles.noDataTitle}>No Details Available</Text>
        <Text style={styles.noDataMessage}>
          Company details are not available for this stock right now. The stock
          data may be limited or this could be a newly listed security.
        </Text>
      </View>
    </View>
  );

  const CollapsibleAbout: React.FC<{ description: string }> = ({
    description,
  }) => {
    const [expanded, setExpanded] = useLocalState(false);
    const numberOfLines = expanded ? undefined : 2;
    return (
      <View style={{ marginTop: 8, marginBottom: 4 }}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText} numberOfLines={numberOfLines}>
          {description}
        </Text>
        {description.length > 80 && (
          <TouchableOpacity onPress={() => setExpanded((e) => !e)}>
            <Text style={styles.aboutToggle}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Current Price Section */}
        {stock && (
          <View style={styles.priceSection}>
            <View style={styles.priceHeader}>
              <View style={styles.stockTitleContainer}>
                <StockLogo symbol={stock.symbol} size={52} />
                <View style={styles.stockTitleText}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <View style={styles.nameRow}>
                    <Text style={styles.stockName} numberOfLines={2}>
                      {stock.name}
                    </Text>
                    {companyData && companyData.OfficialSite && (
                      <TouchableOpacity
                        style={styles.websiteButton}
                        onPress={() => {
                          Linking.openURL(companyData.OfficialSite);
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="open-outline"
                          size={18}
                          color={colors.primary}
                          style={{ marginRight: 2 }}
                        />
                        <Text style={styles.websiteButtonText}>Website</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.currentPrice}>
                ${parseFloat(stock.price).toFixed(4)}
              </Text>
            </View>
            <Text style={styles.lastUpdated}>
              Volume: {parseInt(stock.volume).toLocaleString()}
            </Text>
          </View>
        )}

        {companyData && companyData.Description && (
          <View style={styles.section}>
            <CollapsibleAbout description={companyData.Description} />
          </View>
        )}

        {companyData && hasMinimalCompanyData(companyData) && (
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Info</Text>
            <View style={styles.tagsWrapper}>
              {getCompanyTags(companyData).map((tag, index) => (
                <Tag
                  key={index}
                  label={tag.label}
                  value={tag.value}
                  variant={tag.variant}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.chartContainer}>
          <StockChart data={chartData["Time Series (Daily)"]} symbol={symbol} />
        </View>

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
                        <MetricCard
                          label={metric.label}
                          value={metric.value}
                          trend={metric.trend}
                          size="medium"
                        />
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
                  <Text style={styles.sectionTitle}>Company Details</Text>
                  {companyInfo.map((info, index) => (
                    <View key={index} style={styles.overviewItem}>
                      <Text style={styles.overviewLabel}>{info.label}</Text>
                      <Text style={styles.overviewValue}>{info.value}</Text>
                    </View>
                  ))}
                </View>
              );
            })()}
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
