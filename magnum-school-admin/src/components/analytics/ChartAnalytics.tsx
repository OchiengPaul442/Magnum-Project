import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartAnalyticsProps {
  data: { month: string; value: number }[];
}

const ChartAnalytics: React.FC<ChartAnalyticsProps> = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2024');

  // Filter data based on the selected month
  const filteredData = data.filter(
    (entry) => entry.month === selectedMonth.slice(0, 3),
  );

  const months = [
    'January 2024',
    'February 2024',
    'March 2024',
    'April 2024',
    'May 2024',
    'June 2024',
    'July 2024',
    'August 2024',
    'September 2024',
    'October 2024',
    'November 2024',
    'December 2024',
  ];

  return (
    <div className="p-4 bg-white rounded-lg w-full mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-gray-800">
          Total Monthly Transactions: UGX{' '}
          {filteredData
            .reduce((acc, curr) => acc + curr.value, 0)
            .toLocaleString()}
        </h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-100"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={375}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6B46C1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis dataKey="month" hide />
          <YAxis tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6B46C1"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartAnalytics;
