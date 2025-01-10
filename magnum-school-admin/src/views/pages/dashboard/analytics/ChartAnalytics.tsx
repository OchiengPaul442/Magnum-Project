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

export default function ChartAnalytics({ data }: ChartAnalyticsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('September');

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-base text-gray-800">
          Total Monthly Transactions: UGX{' '}
          {data
            ?.find((d) => d.month === selectedMonth)
            ?.total.toLocaleString() ?? 0}
        </h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px] bg-gray-50">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((entry) => (
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
              horizontal={true}
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}`}
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
