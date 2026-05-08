import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/localStorage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    return getStorageItem('theme', 'dark') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      setStorageItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      setStorageItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
};
