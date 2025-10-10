// Компонент временного графика аномалий

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimelineData } from '../../types/anomalies';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { TrendingUp, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TimelineChartProps {
  data: TimelineData[];
  loading?: boolean;
  className?: string;
  mode?: 'probability' | 'anomaly';
}

const anomalyColors = {
  weight_anomalies: '#dc2626',    // Красный
  time_anomalies: '#ea580c',      // Оранжевый
  route_anomalies: '#d97706',     // Желтый
  duplicates: '#2563eb',          // Синий
  total: '#16a34a'                // Зеленый
};

const probabilityColors = {
  high_probability: '#dc2626',     // Красный
  elevated_probability: '#ea580c', // Оранжевый
  medium_probability: '#d97706',   // Желтый
  low_probability: '#2563eb',      // Синий
  total: '#16a34a'                 // Зеленый
};

const anomalyLabels = {
  weight_anomalies: 'Весовые',
  time_anomalies: 'Временные',
  route_anomalies: 'Маршрутные',
  duplicates: 'Дубликаты',
  total: 'Общее количество'
};

const probabilityLabels = {
  high_probability: 'Высокая вероятность',
  elevated_probability: 'Повышенная вероятность',
  medium_probability: 'Средняя вероятность',
  low_probability: 'Низкая вероятность',
  total: 'Общее количество'
};

export function TimelineChart({ data, loading = false, className, mode = 'anomaly' }: TimelineChartProps) {
  
  // Выбираем цвета и лейблы в зависимости от режима
  const colors = mode === 'probability' ? probabilityColors : anomalyColors;
  const labels = mode === 'probability' ? probabilityLabels : anomalyLabels;
  
  // Генерируем данные для графика вероятностей
  const probabilityData = [
  { date: "2025-06-01", high_probability: 12, elevated_probability: 4, medium_probability: 12, low_probability: 30 },
  { date: "2025-06-02", high_probability: 2, elevated_probability: 0, medium_probability: 1, low_probability: 29 },
  { date: "2025-06-03", high_probability: 8, elevated_probability: 2, medium_probability: 1, low_probability: 21 },
  { date: "2025-06-04", high_probability: 15, elevated_probability: 2, medium_probability: 1, low_probability: 34 },
  { date: "2025-06-05", high_probability: 8, elevated_probability: 0, medium_probability: 4, low_probability: 46 },
  { date: "2025-06-06", high_probability: 20, elevated_probability: 0, medium_probability: 0, low_probability: 23 },
  { date: "2025-06-07", high_probability: 23, elevated_probability: 0, medium_probability: 1, low_probability: 18 },
  { date: "2025-06-08", high_probability: 10, elevated_probability: 0, medium_probability: 0, low_probability: 25 },
  { date: "2025-06-09", high_probability: 8, elevated_probability: 0, medium_probability: 0, low_probability: 19 },
  { date: "2025-06-10", high_probability: 5, elevated_probability: 0, medium_probability: 0, low_probability: 17 },
  { date: "2025-06-11", high_probability: 9, elevated_probability: 0, medium_probability: 1, low_probability: 13 },
  { date: "2025-06-12", high_probability: 11, elevated_probability: 0, medium_probability: 0, low_probability: 2 },
  { date: "2025-06-13", high_probability: 7, elevated_probability: 2, medium_probability: 0, low_probability: 36 },
  { date: "2025-06-14", high_probability: 10, elevated_probability: 0, medium_probability: 0, low_probability: 13 },
  { date: "2025-06-15", high_probability: 0, elevated_probability: 0, medium_probability: 0, low_probability: 9 },
  { date: "2025-06-16", high_probability: 3, elevated_probability: 0, medium_probability: 0, low_probability: 18 },
  { date: "2025-06-17", high_probability: 13, elevated_probability: 0, medium_probability: 0, low_probability: 6 },
  { date: "2025-06-18", high_probability: 29, elevated_probability: 0, medium_probability: 0, low_probability: 4 },
  { date: "2025-06-19", high_probability: 1, elevated_probability: 0, medium_probability: 0, low_probability: 4 },
  { date: "2025-06-20", high_probability: 4, elevated_probability: 0, medium_probability: 0, low_probability: 0 },
  { date: "2025-06-21", high_probability: 1, elevated_probability: 0, medium_probability: 2, low_probability: 0 },
  { date: "2025-06-22", high_probability: 10, elevated_probability: 0, medium_probability: 3, low_probability: 2 },
  { date: "2025-06-23", high_probability: 13, elevated_probability: 0, medium_probability: 0, low_probability: 0 },
  { date: "2025-06-24", high_probability: 29, elevated_probability: 0, medium_probability: 0, low_probability: 0 },
  { date: "2025-06-25", high_probability: 4, elevated_probability: 0, medium_probability: 0, low_probability: 0 },
];
  
  const chartData = mode === 'probability' ? probabilityData : data;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Динамика {mode === 'probability' ? 'вероятностей' : 'аномалий'}</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit',
      month: '2-digit'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {labels[entry.dataKey as keyof typeof labels]}
                </span>
              </div>
              <span className="text-sm font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Вычисляем тренды
  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  const totalTrend = previousData ? getTrend(latestData?.total || 0, previousData.total) : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Динамика {mode === 'probability' ? 'вероятностей' : 'аномалий'}</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Последние 30 дней</span>
            </div>
            
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => (
                  <span className="text-sm">
                    {labels[value as keyof typeof labels]}
                  </span>
                )}
              />
              
              {mode === 'probability' ? (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="high_probability" 
                    stroke={colors.high_probability}
                    strokeWidth={2}
                    dot={{ fill: colors.high_probability, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.high_probability, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="elevated_probability" 
                    stroke={colors.elevated_probability}
                    strokeWidth={2}
                    dot={{ fill: colors.elevated_probability, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.elevated_probability, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="medium_probability" 
                    stroke={colors.medium_probability}
                    strokeWidth={2}
                    dot={{ fill: colors.medium_probability, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.medium_probability, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low_probability" 
                    stroke={colors.low_probability}
                    strokeWidth={2}
                    dot={{ fill: colors.low_probability, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.low_probability, strokeWidth: 2 }}
                  />
                </>
              ) : (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="weight_anomalies" 
                    stroke={colors.weight_anomalies}
                    strokeWidth={2}
                    dot={{ fill: colors.weight_anomalies, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.weight_anomalies, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time_anomalies" 
                    stroke={colors.time_anomalies}
                    strokeWidth={2}
                    dot={{ fill: colors.time_anomalies, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.time_anomalies, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="route_anomalies" 
                    stroke={colors.route_anomalies}
                    strokeWidth={2}
                    dot={{ fill: colors.route_anomalies, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.route_anomalies, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duplicates" 
                    stroke={colors.duplicates}
                    strokeWidth={2}
                    dot={{ fill: colors.duplicates, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.duplicates, strokeWidth: 2 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}