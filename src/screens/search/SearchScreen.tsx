import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, SearchResult, LoadingState } from "../../types";
import { alphaVantageApi } from "../../services/alphaVantageApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StockLogo from "../../components/common/StockLogo";
import { searchScreenStyles } from "../../styles/screens/SearchScreen.styles";
import { useTheme } from "../../hooks/useTheme";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const styles = searchScreenStyles(colors);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    setLoadingState({ isLoading: true, error: null });

    try {
      const response = await alphaVantageApi.searchSymbol(searchQuery.trim());

      if (response.bestMatches && response.bestMatches.length > 0) {
        setSearchResults(response.bestMatches);
      } else {
        setSearchResults([]);
      }

      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      console.error("Search error:", error);
      setLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Search failed",
      });
    }
  };

  const handleStockPress = (result: SearchResult) => {
    navigation.navigate("ProductScreen", {
      symbol: result["1. symbol"],
      name: result["2. name"],
    });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleStockPress(item)}
    >
      <View style={styles.resultHeader}>
        <View style={styles.symbolContainer}>
          <StockLogo symbol={item["1. symbol"]} size={32} />
          <Text style={styles.symbol}>{item["1. symbol"]}</Text>
        </View>
        {/* <Text style={styles.matchScore}>
          {(parseFloat(item['9. matchScore']) * 100).toFixed(0)}% match
        </Text> */}
      </View>

      <Text style={styles.companyName} numberOfLines={2}>
        {item["2. name"]}
      </Text>

      <View style={styles.resultFooter}>
        <Text style={styles.type}>{item["3. type"]}</Text>
        <Text style={styles.region}>{item["4. region"]}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loadingState.isLoading) {
      return <LoadingSpinner message="Searching..." />;
    }

    if (loadingState.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loadingState.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchResults.length === 0 && searchQuery.trim()) {
      return (
        <EmptyState
          icon="search-outline"
          title="No Results Found"
          message={`No stocks found for "${searchQuery}". Try a different search term.`}
        />
      );
    }

    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Search Stocks"
          message="Enter a company name or stock symbol to search for stocks and ETFs."
        />
      );
    }

    return (
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item["1. symbol"]}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks, ETFs, companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loadingState.isLoading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </View>
  );
};

export default SearchScreen;
