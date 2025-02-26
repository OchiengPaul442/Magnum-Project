import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity as ActivityIcon } from 'lucide-react';
import { EmptyStateCard } from '@/components/shared/EmptyStateCard';

interface ActivityData {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityData[];
}

const colors = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-purple-500',
  'bg-indigo-500',
];

export default function RecentActivity({ activities }: RecentActivityProps) {
  // If there are no activities, use the reusable empty state component
  if (!activities?.length) {
    return (
      <EmptyStateCard
        title="Recent Activity"
        mainMessage="No recent activity"
        subMessage="Activity will appear here when users interact with the system."
        icon={<ActivityIcon className="h-12 w-12 text-gray-400 mb-4" />}
      />
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      {/* Fixed height container, scrollable content */}
      <CardContent className="h-[400px] overflow-y-auto">
        <div className="space-y-6">
          {activities.map((activity, index) => {
            // Convert timestamp to a Date object
            const date = new Date(activity.timestamp);

            // Show "Today"/"Yesterday" or a full date/time
            let displayDate = format(date, 'PPP p');
            if (isToday(date)) {
              displayDate = `Today at ${format(date, 'h:mm a')}`;
            } else if (isYesterday(date)) {
              displayDate = `Yesterday at ${format(date, 'h:mm a')}`;
            }

            return (
              <div key={activity.id} className="flex items-start gap-3">
                {/* Colored dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full mt-2 ${
                    colors[index % colors.length]
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 leading-none">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{displayDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
