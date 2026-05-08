import React, { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const NewsDistributionChart = ({ news, isDark, onSliceClick }) => {
  const chartRef = useRef(null);

  const categories = Object.keys(news || {});
  const dataCounts = categories.map(cat => news[cat]?.length || 0);

  const colors = [
    'rgba(59, 130, 246, 0.8)', // blue
    'rgba(16, 185, 129, 0.8)', // green
    'rgba(245, 158, 11, 0.8)', // yellow
    'rgba(239, 68, 68, 0.8)',  // red
    'rgba(139, 92, 246, 0.8)', // purple
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: dataCounts,
        backgroundColor: colors,
        borderColor: isDark ? '#111827' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${context.raw} articles`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onSliceClick) {
        const index = elements[0].index;
        onSliceClick(categories[index]);
      }
    }
  };

  if (categories.length === 0 || dataCounts.every(c => c === 0)) {
    return <div className="text-center text-gray-500 py-8">No data to display</div>;
  }

  return (
    <div className="w-full aspect-square relative cursor-pointer">
      <Doughnut ref={chartRef} data={data} options={options} />
    </div>
  );
};
