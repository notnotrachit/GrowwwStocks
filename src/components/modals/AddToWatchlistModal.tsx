import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stock, Watchlist } from "../../types";
import { DIMENSIONS } from "../../constants";
import { useTheme } from "../../hooks/useTheme";
import { watchlistService } from "../../services/watchlistService";
import {
  createModalSlideAnimation,
  createBackdropFadeAnimation,
  createFadeInAnimation,
  createElasticAnimation,
} from "../../utils/animations";

interface AddToWatchlistModalProps {
  isVisible: boolean;
  onClose: () => void;
  stock: Stock | null;
  onSuccess: () => void;
}

const AddToWatchlistModal: React.FC<AddToWatchlistModalProps> = ({
  isVisible,
  onClose,
  stock,
  onSuccess,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      loadWatchlists();
      setNewWatchlistName("");
      setSelectedWatchlists([]);

      // Show modal with animations
      Animated.parallel([
        createBackdropFadeAnimation(backdropAnim, 1),
        createModalSlideAnimation(slideAnim, 0),
        createFadeInAnimation(contentAnim, 300, 100),
      ]).start();
    } else {
      // Hide modal with animations
      Animated.parallel([
        createBackdropFadeAnimation(backdropAnim, 0),
        createModalSlideAnimation(slideAnim, Dimensions.get("window").height),
      ]).start();
    }
  }, [isVisible]);

  const loadWatchlists = async () => {
    try {
      const lists = await watchlistService.getWatchlists();
      setWatchlists(lists);
    } catch (error) {
      console.error("Error loading watchlists:", error);
    }
  };

  const handleCreateNewWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      Alert.alert("Error", "Please enter a watchlist name");
      return;
    }

    if (!stock) return;

    setIsLoading(true);
    try {
      const newWatchlist = await watchlistService.createWatchlist(
        newWatchlistName.trim()
      );
      await watchlistService.addStockToWatchlist(newWatchlist.id, stock);

      setNewWatchlistName("");
      await loadWatchlists();

      Alert.alert(
        "Success",
        `Added ${stock.symbol} to new watchlist "${newWatchlist.name}". You can continue managing other watchlists.`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create watchlist"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatchlist = (watchlistId: string) => {
    setSelectedWatchlists((prev) => {
      if (prev.includes(watchlistId)) {
        return prev.filter((id) => id !== watchlistId);
      } else {
        return [...prev, watchlistId];
      }
    });
  };

  const handleApplyChanges = async () => {
    if (!stock) return;

    setIsLoading(true);
    try {
      const watchlistsToAdd: string[] = [];
      const watchlistsToRemove: string[] = [];

      for (const watchlist of watchlists) {
        const hasStock = watchlist.stocks.some(
          (s) => s.symbol === stock.symbol
        );
        const isSelected = selectedWatchlists.includes(watchlist.id);

        if (hasStock && isSelected) {
          watchlistsToRemove.push(watchlist.id);
        } else if (!hasStock && isSelected) {
          watchlistsToAdd.push(watchlist.id);
        }
      }

      for (const watchlistId of watchlistsToRemove) {
        await watchlistService.removeStockFromWatchlist(
          watchlistId,
          stock.symbol
        );
      }

      if (watchlistsToAdd.length > 0) {
        await watchlistService.addStockToMultipleWatchlists(
          watchlistsToAdd,
          stock
        );
      }

      const addedNames = watchlists
        .filter((w) => watchlistsToAdd.includes(w.id))
        .map((w) => w.name);
      const removedNames = watchlists
        .filter((w) => watchlistsToRemove.includes(w.id))
        .map((w) => w.name);

      let message = "";
      if (addedNames.length > 0) {
        message += `Added to: ${addedNames.join(", ")}`;
      }
      if (removedNames.length > 0) {
        if (message) message += "\n";
        message += `Removed from: ${removedNames.join(", ")}`;
      }

      if (message) {
        Alert.alert("Success", message);
      }

      setSelectedWatchlists([]);
      await loadWatchlists();
      onSuccess();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update watchlists"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: backdropAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"],
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
                opacity: contentAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.container}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Manage Watchlists</Text>
                <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>

              {stock && (
                <View style={styles.stockInfo}>
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.stockName}>{stock.name}</Text>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Create New Watchlist</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="New Watchlist Name"
                    value={newWatchlistName}
                    onChangeText={setNewWatchlistName}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={handleCreateNewWatchlist}
                    disabled={isLoading}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.section, styles.lastSection]}>
                <Text style={styles.sectionTitle}>Existing Watchlists</Text>
                <Text style={styles.instructionText}>
                  Tap to add/remove from watchlists
                </Text>

                {watchlists.length > 0 ? (
                  <>
                    <ScrollView
                      style={styles.watchlistList}
                      showsVerticalScrollIndicator={false}
                    >
                      {watchlists.map((item) => {
                        const isSelected = selectedWatchlists.includes(item.id);
                        const hasStock =
                          stock &&
                          item.stocks.some((s) => s.symbol === stock.symbol);

                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.watchlistItem}
                            onPress={() => handleToggleWatchlist(item.id)}
                          >
                            <View style={styles.watchlistInfo}>
                              <Text style={styles.watchlistName}>
                                {item.name}
                              </Text>
                              <Text style={styles.stockCount}>
                                {item.stocks.length} stocks
                                {hasStock && (
                                  <Text style={styles.currentlyInText}>
                                    {" "}
                                    - Currently in
                                  </Text>
                                )}
                              </Text>
                            </View>

                            {hasStock ? (
                              <Ionicons
                                name={
                                  isSelected
                                    ? "remove-circle"
                                    : "checkmark-circle"
                                }
                                size={24}
                                color={
                                  isSelected ? colors.error : colors.positive
                                }
                              />
                            ) : (
                              <Ionicons
                                name={
                                  isSelected
                                    ? "add-circle"
                                    : "add-circle-outline"
                                }
                                size={24}
                                color={
                                  isSelected
                                    ? colors.primary
                                    : colors.textSecondary
                                }
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {selectedWatchlists.length > 0 && (
                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          isLoading && styles.disabledButton,
                        ]}
                        onPress={handleApplyChanges}
                        disabled={isLoading}
                      >
                        <Text style={styles.confirmButtonText}>
                          Apply Changes ({selectedWatchlists.length})
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text style={styles.emptyText}>No watchlists found</Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    overlayTouchable: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "80%",
      width: "100%",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: DIMENSIONS.padding,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    doneButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: DIMENSIONS.borderRadius,
    },
    doneButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    stockInfo: {
      padding: DIMENSIONS.padding,
      backgroundColor: colors.background,
    },
    stockSymbol: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    stockName: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    section: {
      padding: DIMENSIONS.padding,
    },
    lastSection: {
      paddingBottom: 34, // Safe area padding only for the last section
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    instructionText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 12,
      fontStyle: "italic",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: DIMENSIONS.borderRadius,
      padding: 12,
      marginRight: 12,
      fontSize: 16,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: DIMENSIONS.borderRadius,
    },
    addButtonText: {
      color: colors.surface,
      fontWeight: "bold",
    },
    watchlistList: {
      maxHeight: 200,
    },
    watchlistItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    watchlistInfo: {
      flex: 1,
    },
    watchlistName: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    stockCount: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    currentlyInText: {
      color: colors.positive,
      fontWeight: "500",
    },
    confirmButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: DIMENSIONS.borderRadius,
      alignItems: "center",
      marginTop: 16,
    },
    confirmButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    disabledButton: {
      opacity: 0.5,
    },
    emptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 20,
    },
  });

export default AddToWatchlistModal;
