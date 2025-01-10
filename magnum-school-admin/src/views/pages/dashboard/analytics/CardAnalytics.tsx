import { Card, CardContent } from '@/components/ui/card';
import { FaUsers } from 'react-icons/fa';
import { MdCurrencyExchange } from 'react-icons/md';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface CardAnalyticsProps {
  data: {
    student_count: number;
    monthly_cash_transacted: number;
    monthly_cash_withdrawn: number;
    monthly_cash_received: number;
  };
}

export default function CardAnalytics({ data }: CardAnalyticsProps) {
  const cards = [
    {
      title: 'No. of students',
      value: data?.student_count,
      icon: FaUsers,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Cash transacted',
      value: data?.monthly_cash_transacted,
      icon: MdCurrencyExchange,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-500',
    },
    {
      title: 'Cash withdrawn',
      value: data?.monthly_cash_withdrawn,
      icon: TrendingUp,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
    },
    {
      title: 'Cash received',
      value: data?.monthly_cash_received,
      icon: TrendingDown,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-600">{card.title}</p>
                <div className={`p-3 rounded-full ${card.iconBg}`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold">
                {card.value?.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
