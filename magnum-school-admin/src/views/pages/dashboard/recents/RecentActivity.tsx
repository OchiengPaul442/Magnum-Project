import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const colors = [
  'bg-pink-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-purple-500',
  'bg-indigo-500',
];

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities?.length) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Activity className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">
            No recent activity
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Activity will appear here when users interact with the system.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full mt-2 ${colors[index % colors.length]}`}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
