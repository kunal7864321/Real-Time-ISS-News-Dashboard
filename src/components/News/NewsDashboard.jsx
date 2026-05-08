import React, { useState } from 'react';
import { NewsCategory } from './NewsCategory';
import { NewsDistributionChart } from '../Charts/NewsDistributionChart';
import { Search, Filter, Newspaper } from 'lucide-react';

export const NewsDashboard = ({ newsData, isDark }) => {
  const { news, loading, error, refetchCategory } = newsData;
  const categories = ['Technology', 'Space', 'Science', 'World', 'Business'];
  
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'source'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(null);

  const displayedCategories = activeCategoryFilter ? [activeCategoryFilter] : categories;

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-purple-500" />
          <span>Global Intel Feed</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Search
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="source">Source (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">Distribution</h3>
            <NewsDistributionChart 
              news={news} 
              isDark={isDark} 
              onSliceClick={(cat) => setActiveCategoryFilter(prev => prev === cat ? null : cat)} 
            />
            {activeCategoryFilter && (
              <button 
                onClick={() => setActiveCategoryFilter(null)}
                className="mt-4 w-full py-2 text-sm text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {displayedCategories.map(cat => (
            <NewsCategory 
              key={cat}
              category={cat}
              articles={news[cat]}
              loading={loading[cat]}
              error={error[cat]}
              refetch={refetchCategory}
              filterText={filterText}
              sortBy={sortBy}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
