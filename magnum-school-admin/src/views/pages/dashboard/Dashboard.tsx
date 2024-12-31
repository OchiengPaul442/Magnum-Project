'use client';
import React from 'react';
import RecentTransactions from '@/views/pages/dashboard/recents/RecentTransactions';
import RecentActivity from '@/views/pages/dashboard/recents/RecentActivity';
import CardAnalytics from '@/views/pages/dashboard/analytics/CardAnalytics';
import { transactionData } from '@data/transactions';
import { activitiesData } from '@data/activity';
import { CardAnalyticsData, ChartAnalyticsData } from '@data/analytics';
import ChartAnalytics from '@/views/pages/dashboard/analytics/ChartAnalytics';

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full h-full gap-6">
      <CardAnalytics values={CardAnalyticsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAnalytics data={ChartAnalyticsData} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activitiesData} />
        </div>
      </div>

      <div className="mt-6">
        <RecentTransactions transactions={transactionData} />
      </div>
    </div>
  );
};

export default Dashboard;
