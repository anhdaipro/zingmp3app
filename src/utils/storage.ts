import { createMMKV, MMKV } from 'react-native-mmkv';

// Tạo instance MMKV mặc định
export const storage = createMMKV(
  {
    id: 'user-storage',
    encryptionKey: 'your-encryption-key' // (Optional) Mã hóa dữ liệu
  }
)

// Wrapper giống AsyncStorage để dễ migration
export const Storage = {
  // Set item
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },

  // Get item
  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },

  // Remove item
  removeItem: (key: string) => {
    storage.remove(key);
  },

  // Clear all
  clear: () => {
    storage.clearAll();
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  // Multi get
  multiGet: (keys: string[]): Array<[string, string | undefined]> => {
    return keys.map(key => [key, storage.getString(key)]);
  },

  // Multi set
  multiSet: (keyValuePairs: Array<[string, string]>) => {
    keyValuePairs.forEach(([key, value]) => {
      storage.set(key, value);
    });
  },

  // Multi remove
  multiRemove: (keys: string[]) => {
    keys.forEach(key => {
      storage.remove(key);
    });
  },
};

// Helper functions cho các kiểu dữ liệu khác
export const StorageHelpers = {
  // Set object
  setObject: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },

  // Get object
  getObject: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  // Set number
  setNumber: (key: string, value: number) => {
    storage.set(key, value);
  },

  // Get number
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  // Set boolean
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value);
  },

  // Get boolean
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  // Check if key exists
  hasKey: (key: string): boolean => {
    return storage.contains(key);
  },
};

// Auth storage helpers
export const AuthStorage = {
  setToken: (token: string) => {
    storage.set('auth_token', token);
  },

  getToken: (): string | undefined => {
    return storage.getString('auth_token');
  },

  removeToken: () => {
    storage.remove('auth_token');
  },

  isAuthenticated: (): boolean => {
    return storage.contains('auth_token');
  },

  setUser: (user: any) => {
    storage.set('user_data', JSON.stringify(user));
  },

  getUser: (): any | null => {
    const userData = storage.getString('user_data');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  clearAuth: () => {
    storage.remove('auth_token');
    storage.remove('user_data');
  },
};

export default storage;
