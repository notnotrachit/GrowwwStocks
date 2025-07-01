import AsyncStorage from '@react-native-async-storage/async-storage';
import { Watchlist, Stock } from '../types';
import { STORAGE_KEYS } from '../constants';

export class WatchlistService {
  async getWatchlists(): Promise<Watchlist[]> {
    try {
      const watchlistsJson = await AsyncStorage.getItem(STORAGE_KEYS.WATCHLISTS);
      return watchlistsJson ? JSON.parse(watchlistsJson) : [];
    } catch (error) {
      console.error('Error getting watchlists:', error);
      return [];
    }
  }

  async saveWatchlists(watchlists: Watchlist[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WATCHLISTS, JSON.stringify(watchlists));
    } catch (error) {
      console.error('Error saving watchlists:', error);
      throw new Error('Failed to save watchlists');
    }
  }

  async createWatchlist(name: string): Promise<Watchlist> {
    const watchlists = await this.getWatchlists();
    
    // Check if watchlist with same name exists
    if (watchlists.some(w => w.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Watchlist with this name already exists');
    }

    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name,
      stocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    watchlists.push(newWatchlist);
    await this.saveWatchlists(watchlists);
    
    return newWatchlist;
  }

  async addStockToWatchlist(watchlistId: string, stock: Stock): Promise<void> {
    const watchlists = await this.getWatchlists();
    const watchlistIndex = watchlists.findIndex(w => w.id === watchlistId);
    
    if (watchlistIndex === -1) {
      throw new Error('Watchlist not found');
    }

    const watchlist = watchlists[watchlistIndex];
    
    if (watchlist.stocks.some(s => s.symbol === stock.symbol)) {
      throw new Error('Stock already exists in this watchlist');
    }

    watchlist.stocks.push(stock);
    watchlist.updatedAt = new Date().toISOString();
    
    await this.saveWatchlists(watchlists);
  }

  async addStockToMultipleWatchlists(watchlistIds: string[], stock: Stock): Promise<void> {    
    const watchlists = await this.getWatchlists();
    const errors: string[] = [];
    let hasChanges = false;
    const addedToWatchlists: string[] = [];

    for (const watchlistId of watchlistIds) {
      const watchlistIndex = watchlists.findIndex(w => w.id === watchlistId);
      
      if (watchlistIndex === -1) {
        errors.push(`Watchlist with ID ${watchlistId} not found`);
        continue;
      }

      const watchlist = watchlists[watchlistIndex];
      
      if (watchlist.stocks.some(s => s.symbol === stock.symbol)) {
        errors.push(`Stock already exists in watchlist "${watchlist.name}"`);
        continue;
      }
      watchlist.stocks.push(stock);
      watchlist.updatedAt = new Date().toISOString();
      addedToWatchlists.push(watchlist.name);
      hasChanges = true;
    }

    if (hasChanges) {
      await this.saveWatchlists(watchlists);
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }

  async removeStockFromWatchlist(watchlistId: string, symbol: string): Promise<void> {
    const watchlists = await this.getWatchlists();
    const watchlistIndex = watchlists.findIndex(w => w.id === watchlistId);
    
    if (watchlistIndex === -1) {
      throw new Error('Watchlist not found');
    }

    const watchlist = watchlists[watchlistIndex];
    watchlist.stocks = watchlist.stocks.filter(s => s.symbol !== symbol);
    watchlist.updatedAt = new Date().toISOString();
    
    await this.saveWatchlists(watchlists);
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    const watchlists = await this.getWatchlists();
    const filteredWatchlists = watchlists.filter(w => w.id !== watchlistId);
    await this.saveWatchlists(filteredWatchlists);
  }

  async isStockInAnyWatchlist(symbol: string): Promise<boolean> {
    const watchlists = await this.getWatchlists();
    return watchlists.some(watchlist => 
      watchlist.stocks.some(stock => stock.symbol === symbol)
    );
  }

  async getWatchlistsContainingStock(symbol: string): Promise<Watchlist[]> {
    const watchlists = await this.getWatchlists();
    return watchlists.filter(watchlist => 
      watchlist.stocks.some(stock => stock.symbol === symbol)
    );
  }
}

export const watchlistService = new WatchlistService();