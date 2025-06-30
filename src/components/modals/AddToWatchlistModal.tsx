import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock, Watchlist } from '../../types';
import { COLORS, DIMENSIONS } from '../../constants';
import { watchlistService } from '../../services/watchlistService';

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
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadWatchlists();
      setNewWatchlistName('');
      setSelectedWatchlists([]);
    }
  }, [isVisible]);

  const loadWatchlists = async () => {
    try {
      const lists = await watchlistService.getWatchlists();
      setWatchlists(lists);
    } catch (error) {
      console.error('Error loading watchlists:', error);
    }
  };

  const handleCreateNewWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      Alert.alert('Error', 'Please enter a watchlist name');
      return;
    }

    if (!stock) return;

    setIsLoading(true);
    try {
      const newWatchlist = await watchlistService.createWatchlist(newWatchlistName.trim());
      await watchlistService.addStockToWatchlist(newWatchlist.id, stock);
      
      Alert.alert('Success', `Added ${stock.symbol} to new watchlist "${newWatchlistName}"`);
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatchlist = (watchlistId: string) => {
    setSelectedWatchlists(prev => {
      if (prev.includes(watchlistId)) {
        return prev.filter(id => id !== watchlistId);
      } else {
        return [...prev, watchlistId];
      }
    });
  };

  const handleAddToSelectedWatchlists = async () => {
    if (selectedWatchlists.length === 0) {
      Alert.alert('Error', 'Please select at least one watchlist');
      return;
    }

    if (!stock) return;

    setIsLoading(true);
    try {
      const promises = selectedWatchlists.map(watchlistId =>
        watchlistService.addStockToWatchlist(watchlistId, stock)
      );
      
      await Promise.all(promises);
      
      const selectedNames = watchlists
        .filter(w => selectedWatchlists.includes(w.id))
        .map(w => w.name)
        .join(', ');
      
      Alert.alert('Success', `Added ${stock.symbol} to: ${selectedNames}`);
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add to watchlists');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => {
    const isSelected = selectedWatchlists.includes(item.id);
    const hasStock = stock && item.stocks.some(s => s.symbol === stock.symbol);
    
    return (
      <TouchableOpacity
        style={[styles.watchlistItem, hasStock && styles.disabledItem]}
        onPress={() => !hasStock && handleToggleWatchlist(item.id)}
        disabled={!!hasStock}
      >
        <View style={styles.watchlistInfo}>
          <Text style={[styles.watchlistName, hasStock && styles.disabledText]}>
            {item.name}
          </Text>
          <Text style={[styles.stockCount, hasStock && styles.disabledText]}>
            {item.stocks.length} stocks
          </Text>
        </View>
        
        {hasStock ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.positive} />
        ) : (
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={isSelected ? COLORS.primary : COLORS.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.container} 
          activeOpacity={1} 
          onPress={(e) => e.stopPropagation()}
        >
        <View style={styles.header}>
          <Text style={styles.title}>Add to Watchlist</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
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
              style={[styles.addButton, isLoading && styles.disabledButton]}
              onPress={handleCreateNewWatchlist}
              disabled={isLoading}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existing Watchlists</Text>
          {watchlists.length > 0 ? (
            <>
              <ScrollView style={styles.watchlistList} showsVerticalScrollIndicator={false}>
                {watchlists.map((item) => renderWatchlistItem({ item }))}
              </ScrollView>
              
              {selectedWatchlists.length > 0 && (
                <TouchableOpacity
                  style={[styles.confirmButton, isLoading && styles.disabledButton]}
                  onPress={handleAddToSelectedWatchlists}
                  disabled={isLoading}
                >
                  <Text style={styles.confirmButtonText}>
                    Add to Selected ({selectedWatchlists.length})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>No watchlists found</Text>
          )}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DIMENSIONS.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stockInfo: {
    padding: DIMENSIONS.padding,
    backgroundColor: COLORS.background,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stockName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: DIMENSIONS.padding,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: DIMENSIONS.borderRadius,
  },
  addButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  watchlistList: {
    maxHeight: 200,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  stockCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: DIMENSIONS.borderRadius,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledItem: {
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default AddToWatchlistModal;