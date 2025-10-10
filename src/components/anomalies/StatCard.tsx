// Компонент карточки статистики

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
  description?: string;
  loading?: boolean;
  className?: string;
}

const colorVariants = {
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: 'text-red-600',
    border: 'border-red-200'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: 'text-orange-600',
    border: 'border-orange-200'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: 'text-yellow-600',
    border: 'border-yellow-200'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: 'text-green-600',
    border: 'border-green-200'
  }
};

export function StatCard({ 
  title, 
  value, 
  previousValue,
  icon: Icon, 
  color, 
  description,
  loading = false,
  className 
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('border hover:shadow-md transition-shadow', className)}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colorClass = colorVariants[color];
  
  // Вычисляем изменение в процентах
  const getChangePercentage = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const changePercentage = getChangePercentage();
  const isPositiveChange = changePercentage && changePercentage > 0;

  // Анимированное число
  const AnimatedNumber = ({ value }: { value: number }) => {
    return (
      <span className="font-mono">
        {value.toLocaleString('ru-RU')}
      </span>
    );
  };

  return (
    <Card className={cn(
      'border hover:shadow-lg transition-all duration-200 cursor-pointer',
      'hover:scale-105 transform',
      colorClass.border,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className={cn(
            'p-2 rounded-lg',
            colorClass.bg
          )}>
            <Icon className={cn('h-6 w-6', colorClass.icon)} />
          </div>
        </div>

        <div className="space-y-2">
          <div className={cn('text-2xl font-bold', colorClass.text)}>
            <AnimatedNumber value={value} />
          </div>
        </div>

        {/* Мини-индикатор серьезности */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-4 rounded-full',
                  i < (color === 'red' ? 5 : color === 'orange' ? 4 : color === 'yellow' ? 3 : 2)
                    ? colorClass.icon.replace('text-', 'bg-')
                    : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 uppercase font-medium">
            {color === 'red' ? 'Критичный' : 
             color === 'orange' ? 'Высокий' :
             color === 'yellow' ? 'Средний' : 'Низкий'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}