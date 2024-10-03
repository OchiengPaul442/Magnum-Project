'use client';
import React from 'react';
import RecentTransactions from '@components/recents/RecentTransactions';
import RecentActivity from '@components/recents/RecentActivity';
import CardAnalytics from '@components/analytics/CardAnalytics';
import {
  transactionData,
  activitiesData,
  CardAnalyticsData,
  ChartAnalyticsData,
} from '@lib/mockdata';
import ChartAnalytics from '@components/analytics/ChartAnalytics';

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
