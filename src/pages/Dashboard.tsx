// Главная страница Dashboard

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAnomalyStore } from '../stores/anomalyStore';
import { StatCard } from '../components/anomalies/StatCard';
import { TimelineChart } from '../components/charts/TimelineChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  Route, 
  Copy,
  Eye,
  ArrowRight,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  Info,
  CheckCircle,
  Weight,
  TrendingUp
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { FilterState } from '../types/transit';
import { cn } from '../components/ui/utils';
import { PROBABILITY_DATA, ANOMALY_DATA, QUICK_ACCESS_ITEMS, SYSTEM_STATS } from '../data/staticData';

interface NavigationParams {
  filters?: FilterState;
  highlight?: string;
}

interface DashboardProps {
  onNavigate: (path: string, params?: NavigationParams, activeTab?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'probability' | 'anomaly'>('probability');
  
  const {
    stats,
    criticalAnomalies,
    timelineData,
    loading,
    fetchStats,
    fetchCriticalAnomalies,
    fetchTimelineData
  } = useAnomalyStore();

  useEffect(() => {
    // Загружаем все необходимые данные при монтировании
    fetchStats();
    fetchCriticalAnomalies();
    fetchTimelineData();
  }, [fetchStats, fetchCriticalAnomalies, fetchTimelineData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Критичная';
      case 'high': return 'Высокая';
      case 'medium': return 'Средняя';
      case 'low': return 'Низкая';
      default: return 'Неизвестная';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weight': return AlertTriangle;
      case 'time': return Clock;
      case 'route': return Route;
      case 'duplicate': return Copy;
      default: return AlertTriangle;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'weight': return 'Весовая';
      case 'time': return 'Временная';
      case 'route': return 'Маршрутная';
      case 'duplicate': return 'Дубликат';
      default: return 'Неизвестная';
    }
  };

  const refreshData = () => {
    fetchStats();
    fetchCriticalAnomalies();
    fetchTimelineData();
  };

  // Функции для получения tooltip из централизованных данных
  const getProbabilityTooltip = (probability: string) => {
    const item = PROBABILITY_DATA.find(p => p.probability === probability);
    return item?.tooltip || 'Неизвестная категория вероятности';
  };

  const getAnomalyTooltip = (anomalyType: string) => {
    const item = ANOMALY_DATA.find(a => a.anomalyType === anomalyType);
    return item?.tooltip || 'Неизвестный тип аномалии';
  };

  const handleProbabilityClick = (probability: string) => {
    const filters: FilterState = {
      probability_filter: {
        high: probability === 'high',
        elevated: probability === 'elevated',
        medium: probability === 'medium',
        low: probability === 'low'
      },
      risk_filter: {
        minimal: false,
        low: false,
        medium: false,
        high: false,
        critical: false
      },
      anomaly_filter: {
        weight: false,
        time: false,
        route: false,
        duplicate: false,
        no_anomalies: false
      },
      date_filter: { preset: 'week' },
      geography_filter: { departure_countries: [], destination_countries: [], stations: [] },
      cargo_filter: { cargo_types: [] },
      quick_filters: { only_anomalies: false, high_probability_only: false, recent_only: false }
    };
    
    onNavigate('/transit-table', { 
      filters,
      highlight: `Отфильтровано по вероятности: ${probability === 'high' ? 'Высокая' : probability === 'elevated' ? 'Повышенная' : probability === 'medium' ? 'Средняя' : 'Низкая'}`
    });
  };

  const handleAnomalyClick = (anomalyType: string) => {
    const filters: FilterState = {
      probability_filter: {
        high: false,
        elevated: false,
        medium: false,
        low: false
      },
      risk_filter: {
        minimal: false,
        low: false,
        medium: false,
        high: false,
        critical: false
      },
      anomaly_filter: {
        weight: anomalyType === 'weight',
        time: anomalyType === 'time',
        route: anomalyType === 'route',
        duplicate: anomalyType === 'duplicate',
        no_anomalies: false
      },
      date_filter: { preset: 'week' },
      geography_filter: { departure_countries: [], destination_countries: [], stations: [] },
      cargo_filter: { cargo_types: [] },
      quick_filters: { only_anomalies: true, high_probability_only: false, recent_only: false }
    };
    
    onNavigate('/transit-table', { 
      filters,
      highlight: `Отфильтровано по аномалиям: ${anomalyType === 'weight' ? 'Весовые' : anomalyType === 'time' ? 'Временные' : anomalyType === 'route' ? 'Маршрутные' : 'Дубликаты'}`
    });
  };

  const handleCargoClick = (cargoType: string) => {
    const filters: FilterState = {
      probability_filter: {
        high: false,
        elevated: false,
        medium: false,
        low: false
      },
      risk_filter: {
        minimal: false,
        low: false,
        medium: false,
        high: false,
        critical: false
      },
      anomaly_filter: {
        weight: false,
        time: false,
        route: false,
        duplicate: false,
        no_anomalies: false
      },
      date_filter: { preset: 'month' },
      geography_filter: { departure_countries: [], destination_countries: [], stations: [] },
      cargo_filter: { cargo_types: [cargoType] },
      quick_filters: { only_anomalies: false, high_probability_only: false, recent_only: false }
    };
    
    onNavigate('/transit-table', { 
      filters,
      highlight: `Отфильтровано по грузу: ${cargoType}`
    });
  };

  // Данные для вероятностей (с поддержкой данных из store)
  const probabilityData = PROBABILITY_DATA;

  // Данные для аномалий (с поддержкой данных из store)
  const anomalyData = ANOMALY_DATA.map(item => ({
    ...item,
    value: stats?.[`${item.anomalyType}_anomalies` as keyof typeof stats] || item.value
  }));

  const currentData = viewMode === 'probability' ? probabilityData : anomalyData;

  return (
    <div className="h-full overflow-y-auto">
      <motion.div 
        className="p-6 space-y-6 min-h-full pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Заголовок с действиями */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Обзор системы</h1>
            <p className="text-gray-600 dark:text-gray-400">Мониторинг транзитных операций и аномалий</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Переключатель режима */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'probability' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('probability')}
                className="text-xs"
              >
                <PieChart className="h-4 w-4 mr-1" />
                Вероятности
              </Button>
              <Button
                variant={viewMode === 'anomaly' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('anomaly')}
                className="text-xs"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Аномалии
              </Button>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={loading.stats || loading.critical || loading.timeline}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={cn('h-4 w-4', (loading.stats || loading.critical || loading.timeline) && 'animate-spin')} />
                <span>Обновить</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => onNavigate('/transit-table')}>
                <Eye className="h-4 w-4 mr-2" />
                Таблица операций
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Динамическая статистика */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, staggerChildren: 0.1 }}
        >
          {currentData.map((data, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Tooltip delayDuration={100} skipDelayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Card 
                      className={`${data.colorClass} cursor-help`}
                      onClick={() => {
                        if (viewMode === 'probability' && 'probability' in data) {
                          handleProbabilityClick(data.probability);
                        } else if (viewMode === 'anomaly' && 'anomalyType' in data) {
                          handleAnomalyClick(data.anomalyType);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm ${data.textColor}`}>{data.title}</p>
                            <p className={`text-2xl font-bold ${data.boldColor}`}>{data.value.toLocaleString()}</p>
                            <p className={`text-xs ${data.descColor}`}>{data.description}</p>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <data.icon className={`h-8 w-8 ${data.iconColor}`} />
                            <ArrowRight className={`h-3 w-3 ${data.iconColor} opacity-60`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" sticky="always">
                  <p className="max-w-xs">
                    {viewMode === 'probability' && 'probability' in data
                      ? getProbabilityTooltip(data.probability)
                      : viewMode === 'anomaly' && 'anomalyType' in data
                      ? getAnomalyTooltip(data.anomalyType)
                      : data.description
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>

        

        {/* Основной контент */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* График динамики */}
          <div className="xl:col-span-2">
            <TimelineChart 
              data={timelineData}
              loading={loading.timeline}
              className="h-full"
              mode={viewMode}
            />
          </div>

          {/* Критические аномалии */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-red-600" />
                <span>Критические аномалии</span>
              </CardTitle>
              <Badge variant="destructive" className="text-xs">
                {criticalAnomalies.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 max-h-80 overflow-y-auto">
              {loading.critical ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : criticalAnomalies.length > 0 ? (
                <>
                  {criticalAnomalies.slice(0, 8).map((anomaly) => {
                    const TypeIcon = getTypeIcon(anomaly.type);
                    return (
                      <div 
                        key={anomaly.id}
                        className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => onNavigate('/transit-table')}
                      >
                        <div className={cn(
                          'p-1 rounded-full',
                          getSeverityColor(anomaly.severity).replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', '')
                        )}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {getTypeLabel(anomaly.type)}
                            </p>
                            <Badge 
                              className={cn('text-xs', getSeverityColor(anomaly.severity))}
                            >
                              {getSeverityLabel(anomaly.severity)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {anomaly.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(anomaly.details.timestamp).toLocaleTimeString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {criticalAnomalies.length > 8 && (
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4"
                      onClick={() => onNavigate('/transit-table')}
                    >
                      Показать все ({criticalAnomalies.length})
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Критические аномалии не обнаружены</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Дополнительные секции */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Быстрый доступ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Быстрый доступ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUICK_ACCESS_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Tooltip key={item.id} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Button 
                            variant="outline" 
                            className={`justify-start h-auto p-4 flex flex-col items-start space-y-2 ${item.hoverColor} w-full cursor-help`}
                            onClick={() => onNavigate(item.path, undefined, item.activeTab)}
                          >
                            <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                            <div className="text-left">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                            </div>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sticky="always">
                        <p>{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Статистика системы */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Производительность системы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Показатели производительности */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{SYSTEM_STATS.uptime}%</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Uptime</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{SYSTEM_STATS.responseTime}s</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Отклик системы</p>
                  </motion.div>
                </div>

                {/* Статистика обработки */}
                <motion.div
                  className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Сегодня обработано</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {SYSTEM_STATS.todayOperations.toLocaleString()} операций
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">За эту неделю</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {SYSTEM_STATS.weekOperations.toLocaleString()} операций
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Общий объем данных</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{SYSTEM_STATS.totalRecords.toLocaleString()}+ записей</span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}