import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheItem } from '../types';
import { STORAGE_KEYS } from '../constants';

export class CacheService {
  private getCacheKey(key: string): string {
    return `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
  }

  async set<T>(key: string, data: T, duration: number): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      };
      
      await AsyncStorage.setItem(
        this.getCacheKey(key),
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(key));
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > cacheItem.expiresAt) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getCacheKey(key));
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}