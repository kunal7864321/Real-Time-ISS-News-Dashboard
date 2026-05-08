import React from 'react';
import { ISSMap } from './ISSMap';
import { ISSSpeedChart } from './ISSSpeedChart';
import { PeopleInSpace } from './PeopleInSpace';
import { RefreshCw, MapPin, Navigation, Activity } from 'lucide-react';

export const ISSTracker = ({ issData, loading, error, refetch, countdown, isDark }) => {
  const { position, locationName, speed, path, speedHistory, peopleCount, peopleNames, readingsCount } = issData;

  if (error) {
    return (
      <div className="glass-panel p-6 text-center text-red-500">
        <p>Error loading ISS data: {error}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold flex items-center space-x-2">
          <Activity className="w-6 h-6 text-blue-500" />
          <span>Live Mission Control</span>
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Auto-refresh in {countdown}s
          </span>
          <button 
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-cyan-400 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/40 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & People */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Telemetry Data</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium">{locationName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {position?.latitude?.toFixed(4)}, {position?.longitude?.toFixed(4)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Navigation className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Orbital Speed</p>
                  <p className="font-medium text-xl">{speed?.toFixed(2)} <span className="text-sm">km/h</span></p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">Positions tracked: {readingsCount}</p>
              </div>
            </div>
          </div>
          
          <PeopleInSpace count={peopleCount} names={peopleNames} />
        </div>

        {/* Middle/Right Column - Map & Chart */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="glass-panel p-2 flex-grow h-[400px]">
            {loading && !position ? (
              <div className="h-full flex items-center justify-center">Loading map...</div>
            ) : (
              <ISSMap position={position} path={path} speed={speed} />
            )}
          </div>
          
          <div className="glass-panel p-4">
            <ISSSpeedChart speedHistory={speedHistory} isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
};
