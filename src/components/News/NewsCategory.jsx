import React from 'react';
import { NewsCard } from './NewsCard';
import { SkeletonLoader } from '../UI/SkeletonLoader';
import { RefreshCw } from 'lucide-react';

export const NewsCategory = ({ category, articles, loading, error, refetch, filterText, sortBy }) => {
  let displayedArticles = articles || [];

  if (filterText) {
    const lowerFilter = filterText.toLowerCase();
    displayedArticles = displayedArticles.filter(a => 
      (a.title && a.title.toLowerCase().includes(lowerFilter)) || 
      (a.description && a.description.toLowerCase().includes(lowerFilter))
    );
  }

  if (sortBy === 'newest') {
    displayedArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } else if (sortBy === 'oldest') {
    displayedArticles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  } else if (sortBy === 'source') {
    displayedArticles.sort((a, b) => {
      const srcA = a.source?.name || '';
      const srcB = b.source?.name || '';
      return srcA.localeCompare(srcB);
    });
  }

  return (
    <div className="mb-8" id={`category-${category}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-heading font-bold flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
          {category}
        </h3>
        <button 
          onClick={() => refetch(category)}
          disabled={loading}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
          title={`Refresh ${category}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div className="glass-panel p-6 text-center text-red-500">
          <p>Error loading {category} news: {error}</p>
          <button onClick={() => refetch(category)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
        </div>
      ) : loading && !articles?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} type="news" />)}
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="glass-panel p-8 text-center text-gray-500">
          No articles found for "{category}" matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedArticles.map((article, idx) => (
            <NewsCard key={`${article.url}-${idx}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
