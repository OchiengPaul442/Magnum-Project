import React from 'react';
import { cn } from '@lib/utils';

interface Activity {
  id: number;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const colors = [
    'bg-teal-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-purple-500',
  ];

  return (
    <div className="p-3 bg-white w-full rounded-lg">
      {/* Header Section */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      {/* Activity List  */}
      <div className="space-y-3 max-h-[390px] overflow-y-auto">
        {activities.map((activity) => {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          return (
            <div
              key={activity.id}
              className="flex items-center p-3 rounded-lg bg-gray-50"
            >
              <div
                className={cn('h-3 w-3 rounded-full mr-4', randomColor)}
              ></div>

              <div>
                <p className="text-gray-800 font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
