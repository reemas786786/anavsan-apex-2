/**
 * A safe wrapper around localStorage that falls back to in-memory storage
 * if localStorage is unavailable (e.g., when run within restricted iframes).
 */

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    const retrieved = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    return retrieved === testKey;
  } catch (e) {
    return false;
  }
};

const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (isLocalStorageAvailable()) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Fallback to memory
    }
    return memoryStorage[key] !== undefined ? memoryStorage[key] : null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    memoryStorage[key] = String(value);
  },

  removeItem: (key: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    delete memoryStorage[key];
  },

  clear: (): void => {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.clear();
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    for (const key in memoryStorage) {
      delete memoryStorage[key];
    }
  }
};
