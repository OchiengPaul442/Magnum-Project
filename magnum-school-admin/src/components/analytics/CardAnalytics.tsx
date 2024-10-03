import React, { useState } from 'react';
import { FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdCurrencyExchange } from 'react-icons/md';
import { cn } from '@lib/utils';

interface AnalyticsCardValues {
  noOfStudents: string;
  cashTransacted: string;
  cashWithdrawn: string;
  cashReceived: string;
}

interface CardAnalyticsProps {
  values: AnalyticsCardValues;
}

const CardAnalytics: React.FC<CardAnalyticsProps> = ({ values }) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const cardsData = [
    {
      title: 'No. of students',
      value: values.noOfStudents,
      icon: <FaUsers size={30} />,
      iconBackground: 'bg-purple-100 text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Cash transacted',
      value: values.cashTransacted,
      icon: <MdCurrencyExchange size={30} />,
      iconBackground: 'bg-teal-100 text-teal-600',
      iconColor: 'text-teal-500',
    },
    {
      title: 'Cash withdrawn',
      value: values.cashWithdrawn,
      icon: (
        <FaArrowUp
          size={30}
          style={{ transform: 'rotate(45deg)', strokeWidth: '3px' }}
        />
      ),
      iconBackground: 'bg-red-100 text-red-600',
      iconColor: 'text-red-500',
    },
    {
      title: 'Cash received',
      value: values.cashReceived,
      icon: (
        <FaArrowDown
          size={30}
          style={{ transform: 'rotate(45deg)', strokeWidth: '3px' }}
        />
      ),
      iconBackground: 'bg-teal-100 text-teal-600',
      iconColor: 'text-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsData.map((card, index) => (
        <div
          key={index}
          onClick={() => setActiveCardIndex(index)}
          className={cn(
            'flex flex-col items-center justify-between p-4 rounded-lg gap-4 cursor-pointer transition-colors',
            'w-full h-full max-h-44 aspect-square',
            activeCardIndex === index ? 'bg-[#EEECF3]' : 'bg-white',
          )}
        >
          <div className="flex justify-between w-full">
            <p className="text-[16px] text-gray-600">{card.title}</p>
            <div
              className={cn(
                'p-4 rounded-full flex items-center justify-center transition-all',
                activeCardIndex === index
                  ? 'bg-transparent'
                  : card.iconBackground,
              )}
            >
              {React.cloneElement(card.icon, {
                className:
                  activeCardIndex === index
                    ? ` ${card.iconColor} font-bold`
                    : '',
              })}
            </div>
          </div>

          <div className="flex flex-col text-center mt-2">
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardAnalytics;
