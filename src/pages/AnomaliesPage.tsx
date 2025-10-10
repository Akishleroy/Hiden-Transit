// Страница детального анализа аномалий

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useAnomalyStore } from '../stores/anomalyStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { EnhancedPagination } from '../components/ui/enhanced-pagination';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Clock,
  Route,
  Copy,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../components/ui/utils';

const ANOMALY_COLORS = {
  weight: '#dc2626',
  time: '#ea580c', 
  route: '#d97706',
  duplicate: '#2563eb'
};

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706', 
  low: '#2563eb'
};

export function AnomaliesPage() {
  const {
    anomalies,
    loading,
    filters,
    pagination,
    fetchAnomalies,
    setFilters
  } = useAnomalyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRange, setHoveredRange] = useState<string | null>(null);
  const [highlightedType, setHighlightedType] = useState<string | null>(null);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value });
  };

  const handlePageChange = (page: number) => {
    fetchAnomalies(page);
  };

  const getSeverityBadge = (severity: string) => {
    const labels = {
      critical: 'Критичная',
      high: 'Высокая', 
      medium: 'Средняя',
      low: 'Низкая'
    };
    
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge className={cn('text-xs', colors[severity as keyof typeof colors])}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      weight: AlertTriangle,
      time: Clock,
      route: Route,
      duplicate: Copy
    };
    
    const IconComponent = icons[type as keyof typeof icons] || AlertTriangle;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      weight: 'Весовая',
      time: 'Временная',
      route: 'Маршрутная',
      duplicate: 'Дубликат'
    };
    return labels[type as keyof typeof labels] || 'Неизвестная';
  };

  // Моковые данные для графиков
  const distributionData = [
    { range: '0-10%', count: 1205, percentage: 35.2, dominantType: 'Весовые' },
    { range: '10-25%', count: 892, percentage: 26.1, dominantType: 'Временные' },
    { range: '25-50%', count: 673, percentage: 19.7, dominantType: 'Маршрутные' },
    { range: '50-75%', count: 428, percentage: 12.5, dominantType: 'Весовые' },
    { range: '75-100%', count: 219, percentage: 6.4, dominantType: 'Дубликаты' }
  ];

  const typeDistribution = [
    { name: 'Весовые', value: 15234, color: ANOMALY_COLORS.weight },
    { name: 'Временные', value: 8942, color: ANOMALY_COLORS.time },
    { name: 'Маршрутные', value: 5671, color: ANOMALY_COLORS.route },
    { name: 'Дубликаты', value: 2847, color: ANOMALY_COLORS.duplicate }
  ];

  // Обработчики для взаимодействия между графиками
  const handleBarHover = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const range = data.activePayload[0].payload.range;
      const dominantType = data.activePayload[0].payload.dominantType;
      setHoveredRange(range);
      setHighlightedType(dominantType);
    }
  };

  const handleBarLeave = () => {
    setHoveredRange(null);
    setHighlightedType(null);
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <motion.div 
      className="p-6 space-y-6 min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Заголовок */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Детальный анализ аномалий</h1>
          <p className="text-gray-600 dark:text-gray-400">Исследование и фильтрация обнаруженных аномалий</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => fetchAnomalies()}>
              <RefreshCw className={cn('h-4 w-4 mr-2', loading.anomalies && 'animate-spin')} />
              Обновить
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Графики распределения */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Гистограмма отклонений */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Распределение отклонений
              {hoveredRange && (
                <Badge variant="outline" className="text-xs">
                  Выбран: {hoveredRange}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={distributionData}
                  onMouseMove={handleBarHover}
                  onMouseLeave={handleBarLeave}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'count' ? 'Количество' : 'Процент'
                    ]}
                    labelFormatter={(label) => `Диапазон: ${label}`}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{`Диапазон: ${label}`}</p>
                            <p className="text-sm text-blue-600">{`Количество: ${data.count}`}</p>
                            <p className="text-sm text-gray-600">{`Процент: ${data.percentage}%`}</p>
                            <p className="text-sm text-orange-600 font-medium">{`Основной тип: ${data.dominantType}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Круговая диаграмма типов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Распределение по типам
              {highlightedType && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                  Выделен: {highlightedType}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeDistribution.map((entry, index) => {
                      const isHighlighted = highlightedType === entry.name;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          fillOpacity={highlightedType ? (isHighlighted ? 1 : 0.3) : 1}
                          stroke={isHighlighted ? "#000" : "none"}
                          strokeWidth={isHighlighted ? 2 : 0}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString('ru-RU'), 'Количество']}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        const isHighlighted = highlightedType === data.name;
                        return (
                          <div className={cn(
                            "bg-white border rounded-lg p-3 shadow-lg",
                            isHighlighted && "border-yellow-400 bg-yellow-50"
                          )}>
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{`Количество: ${data.value?.toLocaleString('ru-RU')}`}</p>
                            {isHighlighted && (
                              <p className="text-xs text-yellow-700 mt-1">
                                ⚡ Связан с выбранным диапазоном
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Легенда */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {typeDistribution.map((entry, index) => {
                const isHighlighted = highlightedType === entry.name;
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded",
                      isHighlighted && "bg-yellow-50 border border-yellow-200"
                    )}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: entry.color,
                        opacity: highlightedType ? (isHighlighted ? 1 : 0.3) : 1
                      }}
                    />
                    <span className={cn(
                      "text-gray-700",
                      isHighlighted && "font-medium text-yellow-800"
                    )}>
                      {entry.name}
                    </span>
                    <span className="text-gray-500">
                      ({entry.value.toLocaleString('ru-RU')})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Поиск */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по номеру вагона..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Фильтр по типу */}
            <Select value={filters.type} onValueChange={(value:any) => setFilters({ type: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Тип аномалии" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="weight">Весовые</SelectItem>
                <SelectItem value="time">Временные</SelectItem>
                <SelectItem value="route">Маршрутные</SelectItem>
                <SelectItem value="duplicate">Дубликаты</SelectItem>
              </SelectContent>
            </Select>

            {/* Фильтр по серьезности */}
            <Select value={filters.severity} onValueChange={(value:any) => setFilters({ severity: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Серьезность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни</SelectItem>
                <SelectItem value="critical">Критичные</SelectItem>
                <SelectItem value="high">Высокие</SelectItem>
                <SelectItem value="medium">Средние</SelectItem>
                <SelectItem value="low">Низкие</SelectItem>
              </SelectContent>
            </Select>

            {/* Фильтр по периоду */}
            <Select value={filters.dateRange} onValueChange={(value:any) => setFilters({ dateRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">За день</SelectItem>
                <SelectItem value="7days">За неделю</SelectItem>
                <SelectItem value="30days">За месяц</SelectItem>
                <SelectItem value="90days">За квартал</SelectItem>
              </SelectContent>
            </Select>

            {/* Сброс фильтров */}
            <Button 
              variant="outline" 
              onClick={() => setFilters({ type: 'all', severity: 'all', dateRange: '30days', search: '', minDeviation: 0 })}
            >
              <Filter className="h-4 w-4 mr-2" />
              Сбросить
            </Button>

            {/* Показать детали */}
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              Детали
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица аномалий */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список аномалий</CardTitle>
            <Badge variant="secondary">
              {pagination.total.toLocaleString('ru-RU')} записей
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading.anomalies ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Тип</TableHead>
                      <TableHead>Серьезность</TableHead>
                      <TableHead>Вагон</TableHead>
                      <TableHead>Отклонение</TableHead>
                      <TableHead>Ожидаемое</TableHead>
                      <TableHead>Фактическое</TableHead>
                      <TableHead>Время</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anomalies.map((anomaly) => (
                      <TableRow key={anomaly.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(anomaly.type)}
                            <span className="text-sm">{getTypeLabel(anomaly.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSeverityBadge(anomaly.severity)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {anomaly.wagon_number}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={anomaly.deviation_percent > 50 ? "destructive" : "secondary"}
                            className="font-mono"
                          >
                            {anomaly.deviation_percent}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {typeof anomaly.expected_value === 'number' 
                            ? anomaly.expected_value.toLocaleString('ru-RU')
                            : anomaly.expected_value
                          }
                        </TableCell>
                        <TableCell className="font-mono">
                          {typeof anomaly.actual_value === 'number'
                            ? anomaly.actual_value.toLocaleString('ru-RU') 
                            : anomaly.actual_value
                          }
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(anomaly.timestamp).toLocaleString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Пагинация */}
              <div className="mt-6 space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Показаны {((pagination.current - 1) * pagination.pageSize) + 1}–{Math.min(pagination.current * pagination.pageSize, pagination.total)} из {pagination.total.toLocaleString('ru-RU')} записей
                </div>
                <EnhancedPagination
                  currentPage={pagination.current}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showFirstLast={true}
                  showPageInfo={false}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}