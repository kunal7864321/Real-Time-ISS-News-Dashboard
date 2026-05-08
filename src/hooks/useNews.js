import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getStorageItem, setStorageItem, isCacheValid } from '../utils/localStorage';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Science', 'Business', 'General']; // Space and World mapped appropriately
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const useNews = () => {
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchCategoryNews = useCallback(async (category, force = false) => {
    const cacheKey = `news_${category}`;
    const cachedData = getStorageItem(cacheKey);

    if (!force && cachedData && isCacheValid(cachedData.timestamp, 15)) {
      setNews(prev => ({ ...prev, [category]: cachedData.data }));
      return;
    }

    setLoading(prev => ({ ...prev, [category]: true }));
    setError(prev => ({ ...prev, [category]: null }));

    try {
      // Using a public, free NewsAPI wrapper (saurav.tech) that doesn't require an API key
      let url = '';
      if (category === 'Space' || category === 'World') {
        url = `https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`;
      } else {
        url = `https://saurav.tech/NewsAPI/top-headlines/category/${category.toLowerCase()}/us.json`;
      }

      const response = await axios.get(url);
      
      if (response.data.status === 'error') throw new Error(response.data.message);
      
      const articles = response.data.articles;

      setNews(prev => ({ ...prev, [category]: articles }));
      setStorageItem(cacheKey, { data: articles, timestamp: new Date().getTime() });
      if (force) toast.success(`${category} news refreshed`);
    } catch (err) {
      console.warn(`NewsAPI failed for ${category}. Attempting fallback to EventRegistry...`, err.message);
      
      try {
        // Fallback to EventRegistry
        const eventRegistryResponse = await axios.get('https://eventregistry.org/api/v1/article/getArticles', {
          params: {
            keyword: category === 'World' ? 'Global' : category,
            lang: 'eng',
            articlesCount: 10,
            resultType: 'articles'
          }
        });
        
        const fallbackArticles = eventRegistryResponse.data.articles?.results?.map(item => ({
          title: item.title,
          description: item.body?.substring(0, 150) + '...',
          url: item.url,
          urlToImage: item.image,
          publishedAt: item.dateTimePub,
          source: { name: item.source?.title || 'EventRegistry' },
          author: item.authors?.map(a => a.name).join(', ') || 'Unknown'
        })) || [];

        if (fallbackArticles.length > 0) {
          setNews(prev => ({ ...prev, [category]: fallbackArticles }));
          setStorageItem(cacheKey, { data: fallbackArticles, timestamp: new Date().getTime() });
          if (force) toast.success(`${category} news loaded via fallback`);
        } else {
          throw new Error('No articles found in fallback API');
        }
      } catch (fallbackErr) {
        console.error('Both APIs failed', fallbackErr);
        setError(prev => ({ ...prev, [category]: fallbackErr.message || 'Failed to fetch news' }));
        if (force) toast.error(`Failed to refresh ${category} news`);
        
        // Load from cache if both APIs fail
        if (cachedData) {
          setNews(prev => ({ ...prev, [category]: cachedData.data }));
        }
      }
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  }, []);

  const fetchAllNews = useCallback(() => {
    ['Technology', 'Space', 'Science', 'World', 'Business'].forEach(cat => fetchCategoryNews(cat));
  }, [fetchCategoryNews]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return { news, loading, error, refetchCategory: (cat) => fetchCategoryNews(cat, true) };
};
