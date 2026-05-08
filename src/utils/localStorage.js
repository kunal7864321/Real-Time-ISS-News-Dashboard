export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
};

export const isCacheValid = (timestamp, ttlMinutes = 15) => {
  if (!timestamp) return false;
  const now = new Date().getTime();
  const diffMinutes = (now - timestamp) / (1000 * 60);
  return diffMinutes < ttlMinutes;
};
