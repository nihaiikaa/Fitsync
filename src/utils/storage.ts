export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`fitsync_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Failed to read from localStorage for key: ${key}`, error);
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`fitsync_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage for key: ${key}`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(`fitsync_${key}`);
  } catch (error) {
    console.warn(`Failed to remove from localStorage for key: ${key}`, error);
  }
};
