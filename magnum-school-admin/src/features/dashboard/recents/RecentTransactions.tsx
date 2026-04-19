'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { EmptyStateCard } from '@/components/shared/EmptyStateCard';
interface Transaction {
  name?: string;
  cardNumber?: string;
  amount?: string | number;
  transactionType?: string;
  date?: string;
  student_name?: string;
  card_number?: string;
  transaction_type?: string;
  created_at?: string;
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
      <EmptyStateCard
        title="Recent Transactions"
        buttonText="See All"
        onButtonClick={() => router.push('/transactions')}
        mainMessage="No transactions yet"
        subMessage="Transactions will appear here when they are made."
        icon={<FileText className="h-12 w-12 text-gray-400 mb-4" />}
      />
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
          {transactions.map((transaction, index) => {
            const name =
              transaction.name || transaction.student_name || 'Unknown student';
            const cardNumber =
              transaction.cardNumber || transaction.card_number || 'N/A';
            const transactionType =
              transaction.transactionType ||
              transaction.transaction_type ||
              'unknown';
            const amountValue = Number(transaction.amount || 0);
            const displayDate =
              transaction.date || transaction.created_at || '';
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="w-full sm:w-auto flex items-center mb-2 sm:mb-0">
                  <div className="w-8 text-sm text-gray-500">{index + 1}</div>
                  <span className="text-gray-900 font-medium ml-2 truncate">
                    {name}
                  </span>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center justify-start sm:justify-end flex-wrap gap-2 sm:gap-6">
                  <span className="text-gray-600 font-medium">
                    {cardNumber}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    UGX {amountValue.toLocaleString()}
                  </span>
                  <Badge
                    variant={
                      transactionType.toLowerCase() === 'withdraw'
                        ? 'destructive'
                        : 'default'
                    }
                    className="capitalize px-3 py-1"
                  >
                    {transactionType}
                  </Badge>

                  <span className="text-gray-600">{displayDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
