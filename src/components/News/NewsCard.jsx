import React from 'react';
import { formatPublishedDate } from '../../utils/formatDate';
import { ExternalLink } from 'lucide-react';

export const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source, author } = article;

  return (
    <div className="glass-panel overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
        {urlToImage ? (
          <img 
            src={urlToImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
          {source?.name || 'Unknown'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-500 transition-colors">
          <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {description || 'No description available for this article.'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="truncate max-w-[50%]">
            {author || 'Unknown Author'}
          </div>
          <div>
            {formatPublishedDate(publishedAt)}
          </div>
        </div>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center space-x-2 w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors font-medium text-sm"
        >
          <span>Read More</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
