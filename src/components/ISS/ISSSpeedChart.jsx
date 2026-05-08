import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const ISSSpeedChart = ({ speedHistory, isDark }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'ISS Speed (km/h)',
        color: isDark ? '#e5e7eb' : '#374151',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
        ticks: { color: isDark ? '#9ca3af' : '#4b5563' }
      },
      y: {
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
        ticks: { color: isDark ? '#9ca3af' : '#4b5563' }
      }
    },
    elements: {
      line: {
        tension: 0.4 // smooth curve
      }
    }
  };

  const data = {
    labels: speedHistory.map(item => item.time),
    datasets: [
      {
        fill: true,
        label: 'Speed (km/h)',
        data: speedHistory.map(item => item.speed),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  };

  return (
    <div className="h-64 w-full">
      {speedHistory.length > 0 ? (
        <Line options={options} data={data} />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          Gathering speed data...
        </div>
      )}
    </div>
  );
};
