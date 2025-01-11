'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  data: { month: string; total: number }[];
}

// Custom YAxis component with default parameters
const CustomYAxis = ({
  tickFormatter = (value: number) => `${value}`,
  axisLine = true,
  tickLine = true,
  reversed = false,
  ...props
}: {
  tickFormatter?: (value: number) => string;
  axisLine?: boolean;
  tickLine?: boolean;
  reversed?: boolean;
  [key: string]: any;
}) => {
  return (
    <YAxis
      tickFormatter={tickFormatter}
      axisLine={axisLine}
      tickLine={tickLine}
      reversed={reversed}
      {...props}
    />
  );
};

export default function ChartAnalytics({ data }: ChartAnalyticsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('September');

  // Find the total for the selected month
  const selectedData = data.find((d) => d.month === selectedMonth);
  const totalTransactions = selectedData ? selectedData.total : 0;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-base text-gray-800">
          Total Monthly Transactions: UGX {totalTransactions.toLocaleString()}
        </h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px] bg-gray-50">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {data.map((entry) => (
              <SelectItem key={entry.month} value={entry.month}>
                {entry.month} 2024
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={375}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal
              vertical={false}
              stroke="#E5E7EB"
            />
            {/* Remove x-axis labels by setting tick={false} */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <CustomYAxis
              tickFormatter={(value: number) => `UGX ${value.toLocaleString()}`}
              axisLine={false}
              tickLine={false}
              reversed
            />
            <Tooltip
              formatter={(value: number) => [
                `UGX ${value.toLocaleString()}`,
                'Total',
              ]}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
