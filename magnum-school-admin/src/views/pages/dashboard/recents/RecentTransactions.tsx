'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface Transaction {
  name: string;
  cardNumber: string;
  amount: string;
  transactionType: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  const router = useRouter();

  if (!transactions?.length) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="link" onClick={() => router.push('/transactions')}>
            See All
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">
            No transactions yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Transactions will appear here when they are made.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Recent Transactions
        </CardTitle>
        <Button
          variant="link"
          onClick={() => router.push('/transactions')}
          className="text-teal-600 font-medium hover:text-teal-700"
        >
          See All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="w-full sm:w-auto flex items-center mb-2 sm:mb-0">
                <div className="w-8 text-sm text-gray-500">{index + 1}</div>
                <span className="text-gray-900 font-medium ml-2 truncate">
                  {transaction.name}
                </span>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center justify-start sm:justify-end flex-wrap gap-2 sm:gap-6">
                <span className="text-gray-600 font-medium">
                  {transaction.cardNumber}
                </span>
                <span className="text-gray-900 font-semibold">
                  UGX {parseInt(transaction.amount).toLocaleString()}
                </span>
                <Badge
                  variant={
                    transaction.transactionType.toLowerCase() === 'withdraw'
                      ? 'destructive' // Map 'warning' to 'destructive'
                      : 'default' // Map 'success' to 'default'
                  }
                  className="capitalize px-3 py-1"
                >
                  {transaction.transactionType}
                </Badge>

                <span className="text-gray-600">{transaction.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
