// Компонент с графиками и диаграммами для статистики

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Weight,
  Route,
  Copy,
  Activity,
  Train
} from 'lucide-react';
import { DashboardStats } from '../../types/transit';
import { AnalyticsClickData } from '../../utils/analyticsNavigation';
import { getCountryCodeByShortName } from '../../utils/countryMapping';

interface StatisticsChartsProps {
  data: DashboardStats;
  loading?: boolean;
  className?: string;
  onDataClick?: (clickData: AnalyticsClickData) => void;
}

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({
  data,
  loading = false,
  className,
  onDataClick
}) => {
  // Состояния для интерактивности
  const [pieRotation, setPieRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseAngle, setLastMouseAngle] = useState(0);

  
  // Данные для круговой диаграммы распределения вероятностей
 const probabilityData = [
  { name: 'Высокая', value: 16, color: '#ef4444', percentage: 50 },
  { name: 'Повышенная', value: 1, color: '#f97316', percentage: 25 },
  { name: 'Средняя', value: 7, color: '#eab308', percentage: 15 },
  { name: 'Низкая', value: 76, color: '#22c55e', percentage: 10 },
];
  // Данные для столбчатой диаграммы аномалий
  const anomalyData = Object.entries(data.anomaly_stats.by_type).map(([type, count]) => ({
    name: type === 'weight_anomaly' ? 'Вес' : 
          type === 'time_anomaly' ? 'Время' :
          type === 'route_anomaly' ? 'Маршрут' : 'Дубликаты',
    count,
    percentage: ((count / data.anomaly_stats.total_anomalies) * 100).toFixed(1),
    icon: type === 'weight_anomaly' ? '⚖️' : 
          type === 'time_anomaly' ? '⏰' :
          type === 'route_anomaly' ? '🛣️' : '📋'
  }));

  // Данные для временного графика (показывать только аномалии)
  const timelineData = data.timeline_data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: 'short' 
    }),
    anomaly_percentage: ((item.anomalies_count / item.total_operations) * 100).toFixed(1)
  }));

  // Функция для получения цвета бара
  const getBarColor = (index: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    return colors[index % colors.length];
  };

  // Функции для интерактивности шара
  const getMouseAngle = (event: React.MouseEvent, centerX: number, centerY: number) => {
    const rect = (event.target as Element).getBoundingClientRect();
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setIsDragging(true);
    setLastMouseAngle(getMouseAngle(event, centerX, centerY));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const currentAngle = getMouseAngle(event, centerX, centerY);
    let angleDiff = currentAngle - lastMouseAngle;
    
    // Учитываем переход через 180/-180 градусов
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    setPieRotation(prev => (prev + angleDiff) % 360);
    setLastMouseAngle(currentAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Плавно возвращаем в начальную позицию
    setPieRotation(0);
  };

  // Компонент кастомной подсказки
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 pointer-events-none"
          style={{ pointerEvents: 'none' }}
        >
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Данные из базы знаний для топов
  const topWeightData = [
    { name: 'Уголь каменный', weight: 89750, operations: 2847, country: 'Россия' },
    { name: 'Руда железная', weight: 76240, operations: 1956, country: 'Казахстан' },
    { name: 'Нефть сырая', weight: 68920, operations: 1234, country: 'Беларусь' },
    { name: 'Зерно пшеница', weight: 54780, operations: 987, country: 'Украина' },
    { name: 'Металлолом', weight: 45680, operations: 756, country: 'Россия' },
    { name: 'Удобрения', weight: 39240, operations: 654, country: 'Беларусь' },
    { name: 'Контейнеры', weight: 32100, operations: 1432, country: 'Китай' },
    { name: 'Лесоматериалы', weight: 28950, operations: 543, country: 'Россия' }
  ];

  const topCountryData = [
    { name: 'Россия', operations: 45679, percentage: 62.7, totalWeight: 2894567 },
    { name: 'Казахстан', operations: 12456, percentage: 17.1, totalWeight: 1245832 },
    { name: 'Беларусь', operations: 8934, percentage: 12.3, totalWeight: 756234 },
    { name: 'Украина', operations: 3567, percentage: 4.9, totalWeight: 345621 },
    { name: 'Китай', operations: 1876, percentage: 2.6, totalWeight: 234567 },
    { name: 'Другие', operations: 492, percentage: 0.7, totalWeight: 89456 }
  ];

  const topStationData = [
    { name: 'Москва-Северная', operations: 15234, delays: 456, efficiency: 97.0, country: 'Россия' },
    { name: 'Алматы-2', operations: 12456, delays: 234, efficiency: 98.1, country: 'Казахстан' },
    { name: 'Минск-Восточный', operations: 8934, delays: 156, efficiency: 98.3, country: 'Беларусь' },
    { name: 'Новосибирск-Главный', operations: 7821, delays: 189, efficiency: 97.6, country: 'Россия' },
    { name: 'Улан-Батор', operations: 5432, delays: 98, efficiency: 98.2, country: 'Монголия' },
    { name: 'Екатеринбург-Сорт.', operations: 4567, delays: 167, efficiency: 96.3, country: 'Россия' },
    { name: 'Брест-Центральный', operations: 3876, delays: 89, efficiency: 97.7, country: 'Беларусь' },
    { name: 'Пекин-Западный', operations: 3567, delays: 89, efficiency: 97.5, country: 'Китай' }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-1 pb-8">
      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500"
            onClick={() => onDataClick?.({
              type: 'top-operations',
              value: 'all'
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Всего операций</p>
                  <motion.p 
                    className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    {("4 410 695")}
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500"
            onClick={() => onDataClick?.({
              type: 'probability-category',
              value: 'high'
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Импорт</p>
                  <motion.p 
                    className="text-2xl font-bold text-red-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    {"922,719"}
                  </motion.p>
                  <motion.p 
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {"20"}%
                  </motion.p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500"
            onClick={() => onDataClick?.({
              type: 'anomaly-type',
              value: 'weight_anomaly',
              additionalData: { category: 'all' }
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Экспорт</p>
                  <motion.p 
                    className="text-2xl font-bold text-orange-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    {"779,112"}
                  </motion.p>
                  <motion.p 
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {"17"}%
                  </motion.p>
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-600"
            onClick={() => onDataClick?.({
              type: 'risk-level',
              value: 'critical'
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Критический риск</p>
                  <motion.p 
                    className="text-2xl font-bold text-red-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  >
                    {"3832"}
                  </motion.p>
                  <motion.p 
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Требуют внимания
                  </motion.p>
                </div>
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
<AlertTriangle className="h-8 w-8 text-orange-600" />                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Распределение вероятностей */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <span>Распределение по вероятностям</span>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center space-x-1">
                    <span>🎯</span>
                    <span>Крутите мышью</span>
                  </div>
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: pieRotation
                }}
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                transition={{ 
                  scale: { delay: 0.8, type: 'spring', stiffness: 200 },
                  rotate: { 
                    duration: isDragging ? 0 : 0.5, 
                    ease: isDragging ? "linear" : "easeInOut" 
                  }
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={probabilityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      onClick={(data) => {
                        if (!isDragging) {
                          const probabilityMap: Record<string, string> = {
                            'Высокая': 'high',
                            'Повышенная': 'elevated',
                            'Средняя': 'medium',
                            'Низкая': 'low'
                          };
                          onDataClick?.({
                            type: 'probability-category',
                            value: probabilityMap[data.name] || 'high'
                          });
                        }
                      }}
                      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {probabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      wrapperStyle={{ pointerEvents: 'none' }}
                      allowEscapeViewBox={{ x: false, y: false }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {probabilityData.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}

                    onClick={() => {
                      const probabilityMap: Record<string, string> = {
                        'Высокая': 'high',
                        'Повышенная': 'elevated',
                        'Средняя': 'medium',
                        'Низкая': 'low'
                      };
                      onDataClick?.({
                        type: 'probability-category',
                        value: probabilityMap[item.name] || 'high'
                      });
                    }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    ></motion.div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}: {item.percentage}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Аномалии по типам */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        backgroundColor: ["#ef4444", "#f97316", "#ef4444"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                    <span>Аномалии по типам</span>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center space-x-1">
                    <span>📊</span>
                    <span>Кликайте по столбцам</span>
                  </div>
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="relative"
                style={{ overflow: 'hidden' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={anomalyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      wrapperStyle={{ pointerEvents: 'none' }}
                      position={{ x: undefined, y: undefined }}
                      allowEscapeViewBox={{ x: false, y: false }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                      onClick={(data) => {
                        const anomalyMap: Record<string, string> = {
                          'Вес': 'weight_anomaly',
                          'Время': 'time_anomaly',
                          'Маршрут': 'route_anomaly',
                          'Дубликаты': 'duplicate_anomaly'
                        };
                        onDataClick?.({
                          type: 'anomaly-type',
                          value: anomalyMap[data.name] || 'weight_anomaly'
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                      animationBegin={300}
                      animationDuration={1200}
                    >
                      {anomalyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getBarColor(index)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {anomalyData.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}

                    onClick={() => {
                      const anomalyData = [
                      { name: 'Вес', count: 12 },
                      { name: 'Время', count: 8 },
                      { name: 'Маршрут', count: 5 },
                      { name: 'Дубликаты', count: 3 },
                    ];

                      onDataClick?.({
                        type: 'anomaly-type',
                        value: anomalyMap[item.name] || 'weight_anomaly'
                      });
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.span 
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1, type: 'spring', stiffness: 200 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Временной график - показывать только аномалии */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span>Динамика аномалий за 30 дней</span>
              <Badge variant="outline" className="text-xs">
                Клик → База знаний
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart 
                data={timelineData}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const clickedData = data.activePayload[0].payload;
                    // Переход в базу знаний для конкретного дня
                    onDataClick?.({
                      type: 'knowledge-base',
                      value: 'anomalies',
                      additionalData: { 
                        date: clickedData.date,
                        anomalies: clickedData.anomalies_count
                      }
                    });
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="anomalies_count" 
                  stackId="1"
                  stroke="#ff7300" 
                  fill="#ff7300"
                  fillOpacity={0.6}
                  name="Аномалии"
                  style={{ cursor: 'pointer' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="high_probability" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.4}
                  name="Высокая вероятность"
                  style={{ cursor: 'pointer' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Виджеты топов */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Топ грузов по весу */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Weight className="h-5 w-5 text-blue-600" />
                <span>Топ грузов по весу</span>
                <Badge variant="outline" className="text-xs">
                  Клик → Фильтр
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {topWeightData.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        onDataClick?.({
                          type: 'cargo-filter',
                          value: item.name,
                          additionalData: { country: item.country }
                        });
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{item.weight.toLocaleString()} т</p>
                        <p className="text-xs text-gray-500">{item.operations} опер.</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        
        {/* Топ стран по грузообороту */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-purple-600" />
                <span>Топ стран по грузообороту</span>
                <Badge variant="outline" className="text-xs">
                  Клик → Фильтр
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {topCountryData.slice(0, 6).map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        // Используем существующую систему фильтрации стран
                        onDataClick?.({
                          type: 'country-filter',
                          value: item.name,
                          additionalData: { 
                            percentage: item.percentage,
                            totalWeight: item.totalWeight
                          }
                        });
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-sm font-bold">{item.percentage}%</p>
                        <p className="text-xs text-gray-500">{item.operations.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
};