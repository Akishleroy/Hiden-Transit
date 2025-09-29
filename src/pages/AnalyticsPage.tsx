// Страница углубленной аналитики с табами

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  TrendingUp, 
  Building2, 
  FileText, 
  DollarSign, 
  Target,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Percent,
  TrendingDown,
  Shield,
  Activity,
  Users,
  Filter,
  Brain,
  Zap,
  Settings,
  Database,
  RefreshCw
} from 'lucide-react';
import { StatisticsCharts } from '../components/charts/StatisticsCharts';
import { ReportsPage } from './ReportsPage';
import { generateMockDashboardStats } from '../services/transitApi';
import { dataService } from '../services/dataService';
import { cn } from '../components/ui/utils';
import { AnalyticsClickData, createNavigationParams } from '../utils/analyticsNavigation';

interface AnalyticsPageProps {
  onNavigateToTable?: (path: string, params?: { filters?: any; highlight?: string }) => void;
  initialActiveTab?: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigateToTable, initialActiveTab = 'analytics' }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'companies' | 'reports' | 'finance' | 'forecast' | 'ai-stats' | 'performance'>(initialActiveTab as any);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedProbabilityLevel, setSelectedProbabilityLevel] = useState<string>('all');
  const [dashboardStats, setDashboardStats] = useState(() => generateMockDashboardStats());

  // Получаем реальные данные из dataService
  useEffect(() => {
    const updateStatsFromImportedData = () => {
      const importedData = dataService.getAllData();
      const stats = dataService.getAnomalyStats();
      
      if (importedData.length > 0) {
        // Создаем статистику на основе реальных данных
        const realStats = {
          total_records: stats.total,
          probability_distribution: {
            high: stats.high,
            elevated: stats.elevated,
            medium: stats.medium,
            low: stats.low
          },
          anomaly_stats: {
            total_anomalies: stats.high + stats.elevated + stats.medium + stats.low,
            by_type: {
              weight_anomaly: Math.floor((stats.high + stats.elevated) * 0.4),
              time_anomaly: Math.floor((stats.high + stats.elevated) * 0.3),
              route_anomaly: Math.floor((stats.high + stats.elevated) * 0.2),
              duplicate_anomaly: Math.floor((stats.high + stats.elevated) * 0.1)
            },
            by_risk: {
              minimal: stats.low,
              low: Math.floor(stats.medium * 0.5),
              medium: Math.floor(stats.medium * 0.5) + stats.elevated,
              high: Math.floor(stats.high * 0.7),
              critical: Math.floor(stats.high * 0.3)
            }
          },
          recent_critical: [], // Заполним позже если нужно
          timeline_data: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            total_operations: Math.floor(stats.total / 30 + Math.random() * 100),
            anomalies_count: Math.floor((stats.high + stats.elevated) / 30 + Math.random() * 10),
            high_probability: Math.floor(stats.high / 30 + Math.random() * 5)
          })).reverse()
        };
        
        setDashboardStats(realStats);
      } else {
        // Используем mock данные если нет импортированных данных
        setDashboardStats(generateMockDashboardStats());
      }
    };

    // Обновляем при инициализации
    updateStatsFromImportedData();
    
    // Подписываемся на изменения данных
    const unsubscribe = dataService.subscribe(() => {
      updateStatsFromImportedData();
    });

    return unsubscribe;
  }, []);

  // Обновляем activeTab при изменении initialActiveTab
  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab as any);
    }
  }, [initialActiveTab]);

  // Обработчик кликов из аналитики
  const handleAnalyticsClick = (clickData: AnalyticsClickData) => {
    if (onNavigateToTable) {
      const navParams = createNavigationParams(clickData);
      onNavigateToTable('/transit-table', navParams);
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Аналитика', icon: BarChart3, description: 'Региональная аналитика' },
    { id: 'companies', label: 'Компании', icon: Building2, description: 'Топ компаний по риску' },
    { id: 'reports', label: 'Отчеты', icon: FileText, description: 'Генерация отчетов' },
    { id: 'finance', label: 'Финансы', icon: DollarSign, description: 'Финансовые показатели' },
    { id: 'forecast', label: 'Прогнозы', icon: Target, description: 'Прогнозы и рекомендации' },
    { id: 'ai-stats', label: 'AI Статистика', icon: Brain, description: 'Статистика ИИ системы' },
    { id: 'performance', label: 'Производительность', icon: Activity, description: 'Мониторинг системы' }
  ];

  // Данные для компаний
  const companiesData = [
    { name: 'ООО "БелЖД Логистик"', city: 'Минск', probability: 'high', operations: 15674, probabilityScore: 8.7, issues: 234, revenue: 2340000, employees: 156 },
    { name: 'ЗАО "ТрансКарго"', city: 'Гомель', probability: 'high', operations: 12456, probabilityScore: 9.2, issues: 187, revenue: 1870000, employees: 134 },
    { name: 'РУП "БелТрансЛогистика"', city: 'Витебск', probability: 'medium', operations: 9876, probabilityScore: 6.4, issues: 89, revenue: 1456000, employees: 98 },
    { name: 'ОАО "МинскТранс"', city: 'Минск', probability: 'low', operations: 7892, probabilityScore: 3.2, issues: 34, revenue: 1234000, employees: 78 },
    { name: 'ИП Иванов С.А.', city: 'Брест', probability: 'medium', operations: 5643, probabilityScore: 5.8, issues: 67, revenue: 890000, employees: 45 },
    { name: 'ООО "ЕвроЛогистик"', city: 'Минск', probability: 'elevated', operations: 4521, probabilityScore: 7.9, issues: 156, revenue: 756000, employees: 67 },
    { name: 'ЧУП "БрестТранзит"', city: 'Брест', probability: 'medium', operations: 3890, probabilityScore: 5.1, issues: 45, revenue: 567000, employees: 34 },
    { name: 'ООО "ГродноГруз"', city: 'Гродно', probability: 'low', operations: 3456, probabilityScore: 2.8, issues: 23, revenue: 456000, employees: 29 },
    { name: 'ЗАО "МогилевЛогистик"', city: 'Могилев', probability: 'elevated', operations: 2987, probabilityScore: 7.3, issues: 89, revenue: 345000, employees: 56 },
    { name: 'ИП Петров А.В.', city: 'Витебск', probability: 'medium', operations: 2456, probabilityScore: 4.5, issues: 34, revenue: 234000, employees: 18 },
    { name: 'ООО "ПолесьеТранс"', city: 'Пинск', probability: 'low', operations: 1987, probabilityScore: 3.8, issues: 12, revenue: 189000, employees: 23 },
    { name: 'РУП "БелКарго"', city: 'Минск', probability: 'high', operations: 1765, probabilityScore: 8.9, issues: 156, revenue: 167000, employees: 45 },
    { name: 'ЧП "ОршаГруз"', city: 'Орша', probability: 'medium', operations: 1543, probabilityScore: 5.6, issues: 28, revenue: 145000, employees: 17 },
    { name: 'ООО "БобруйскТранзит"', city: 'Бобруйск', probability: 'low', operations: 1234, probabilityScore: 2.9, issues: 15, revenue: 123000, employees: 14 },
    { name: 'ИП Сидоров В.И.', city: 'Слуцк', probability: 'elevated', operations: 987, probabilityScore: 7.1, issues: 67, revenue: 98000, employees: 12 }
  ];

  // Финансовые данные
  const financeData = {
    totalWagons: 45678,
    riskWagons: 1347,
    safeWagons: 44331,
    wagonCost: 2500000, // в рублях
    maxLosses: 3367500000, // в рублях
    currentLosses: 234500000,
    potentialSavings: 890000000
  };

  // Прогнозные данные
  const forecastData = {
    key_indicators: [
      { name: 'Вероятность аномалий', current: 4.48, forecast_1y: 3.2, forecast_5y: 2.1, trend: 'down' },
      { name: 'Операционная эффективность', current: 94.2, forecast_1y: 96.8, forecast_5y: 98.5, trend: 'up' },
      { name: 'Финансовые потери', current: 234.5, forecast_1y: 187.2, forecast_5y: 98.4, trend: 'down' },
      { name: 'Автоматизация процессов', current: 67.8, forecast_1y: 78.4, forecast_5y: 92.3, trend: 'up' }
    ],
    recommendations: [
      { period: 'Краткосрочные (1-3 мес)', items: ['Усилить контроль весовых аномалий', 'Внедрить автоматические уведомления', 'Оптимизировать маршруты топ-10 направлений'] },
      { period: 'Среднесрочные (3-12 мес)', items: ['Интеграция с системами партнеров', 'Машинное обучение для прогнозирования', 'Расширение географического покрытия'] },
      { period: 'Долгосрочные (1-5 лет)', items: ['Полная автоматизация процессов', 'Блокчейн для трекинга грузов', 'Создание единой экосистемы логистики'] }
    ]
  };

  // Данные для AI статистики - состояние моделей ИИ
  const aiStats = {
    performance: {
      totalAnalyzed: 728904,
      anomaliesDetected: 32694,
      modelAccuracy: 97.2,
      accuracy: 97.2,
      averageConfidence: 94.8,
      confidence: 94.8,
      responseTime: 150,
      uptime: 99.8,
      savedTime: 45.6,
      falsePositives: 12,
      criticalFound: 234,
      modelsActive: 8,
      learningProgress: 89.3,
      predictionsGenerated: 15674,
      datasetSize: 5623890
    },
    models: [
      { name: 'Анализ весовых аномалий', accuracy: 98.4, processed: 245672, status: 'active', confidence: 97.8 },
      { name: 'Детекция временных сбоев', accuracy: 96.7, processed: 189534, status: 'active', confidence: 95.2 },
      { name: 'Маршрутный анализ', accuracy: 94.2, processed: 156789, status: 'active', confidence: 92.4 },
      { name: 'Прогнозирование рисков', accuracy: 91.8, processed: 98765, status: 'training', confidence: 88.6 },
      { name: 'Анализ документооборота', accuracy: 89.3, processed: 76543, status: 'active', confidence: 86.7 },
      { name: 'Детекция мошенничества', accuracy: 95.6, processed: 54321, status: 'active', confidence: 94.1 }
    ],
    training: {
      datasets: 156,
      totalSamples: 5623890,
      lastTraining: '2024-09-11T02:30:00',
      nextTraining: '2024-09-14T02:30:00',
      accuracy_trend: [94.2, 95.1, 96.3, 96.8, 97.2],
      trainingProgress: 100,
      epochsCompleted: 847,
      learningRate: 0.001
    },
    predictions: {
      todayAccuracy: 97.2,
      tomorrowPrediction: 96.8,
      weekPrediction: 97.5,
      improvementNeeded: ['Анализ новых типов грузов', 'Обучение на сезонных данных'],
      modelVersions: {
        production: 'v2.4.1',
        testing: 'v2.5.0-beta',
        development: 'v2.6.0-alpha'
      }
    }
  };

  // Данные для производительности системы - состояние сервера
  const performanceData = {
    systemMetrics: {
      totalRecords: dashboardStats?.total_records || 728904,
      serverUptime: 99.87,
      lastUpdate: '2 мин назад',
      requestsPerSecond: 1247,
      responseTime: 150,
      memoryUsage: 67.3,
      cpuLoad: 34.2,
      diskUsage: 78.9,
      networkLatency: 23,
      databaseConnections: 156,
      cacheHitRate: 94.6
    },
    monitoring: [
      { metric: 'Сервер доступен', current: 99.87, target: 99.5, status: 'excellent', icon: Shield, unit: '%' },
      { metric: 'Время отклика', current: 150, target: 200, status: 'good', icon: Clock, unit: 'мс' },
      { metric: 'Нагрузка CPU', current: 34.2, target: 70.0, status: 'good', icon: Zap, unit: '%' },
      { metric: 'Использование памяти', current: 67.3, target: 80.0, status: 'good', icon: Activity, unit: '%' },
      { metric: 'Использование диска', current: 78.9, target: 85.0, status: 'warning', icon: Database, unit: '%' },
      { metric: 'Сетевая задержка', current: 23, target: 50, status: 'excellent', icon: Activity, unit: 'мс' }
    ],
    dailyStats: {
      recordsProcessed: 156730,
      requestsProcessed: 156730,
      anomaliesDetected: 743,
      peakRPS: 2847,
      avgResponseTime: 0.15,
      avgProcessingTime: 0.15,
      peakLoad: '14:30 - 15:45',
      systemErrors: 2,
      successRate: 99.97,
      bandwidthUsed: 45.7,
      cacheSize: 2.4
    },
    serverInfo: {
      hostname: 'gray-tranzit-prod-01.kz-central.compute.amazonaws.com',
      os: 'Ubuntu 22.04 LTS',
      architecture: 'x86_64',
      cores: 16,
      memory: '64 GB',
      storage: '2 TB SSD',
      region: 'KZ-Central (Алматы)'
    },
    quickActions: [
      { label: 'Таблица операций', description: 'Полная база данных', icon: Database, action: 'table' },
      { label: 'AI Ассистент', description: 'Умный анализ данных', icon: Brain, action: 'chat' },
      { label: 'Аналитика', description: 'Углубленный анализ', icon: BarChart3, action: 'analytics' },
      { label: 'Перезагрузить сервер', description: 'Перезапуск системы', icon: RefreshCw, action: 'restart' }
    ]
  };

  const getProbabilityBadgeColor = (probability: string) => {
    switch (probability) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'elevated': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityLabel = (probability: string) => {
    switch (probability) {
      case 'high': return 'Высокая';
      case 'elevated': return 'Повышенная';
      case 'medium': return 'Средняя';
      case 'low': return 'Низкая';
      default: return 'Неизвестная';
    }
  };

  const getMonitoringStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (current: number, target: number, isReverse: boolean = false) => {
    const ratio = current / target;
    if (isReverse) {
      return ratio <= 0.7 ? 'bg-green-600' : ratio <= 0.9 ? 'bg-yellow-600' : 'bg-red-600';
    }
    return ratio >= 1 ? 'bg-green-600' : ratio >= 0.8 ? 'bg-yellow-600' : 'bg-red-600';
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'table':
        onNavigateToTable?.('/transit-table');
        break;
      case 'chat':
        onNavigateToTable?.('/chat');
        break;
      case 'analytics':
        setActiveTab('analytics');
        break;
      case 'refresh':
        window.location.reload();
        break;
      default:
        break;
    }
  };

  const filteredCompanies = companiesData.filter(company => {
    const cityMatch = selectedCity === 'all' || company.city === selectedCity;
    const probabilityMatch = selectedProbabilityLevel === 'all' || company.probability === selectedProbabilityLevel;
    return cityMatch && probabilityMatch;
  });

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Заголовок */}
      <motion.div 
        className="flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <TrendingUp className="h-8 w-8 mr-3 text-blue-600" />
            </motion.div>
            Углубленная аналитика
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Детальный анализ транзитных операций и бизнес-метрики
          </motion.p>
        </div>
      </motion.div>

      {/* Вкладки */}
      <motion.div 
        className="border-b border-gray-200 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={activeTab === tab.id ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.5 }}
              >
                <tab.icon className="mr-2 h-5 w-5" />
              </motion.div>
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </div>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Содержимое вкладок */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              className="h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StatisticsCharts
                data={dashboardStats}
                loading={false}
                className="h-full"
                onDataClick={handleAnalyticsClick}
              />
            </motion.div>
          )}

          {activeTab === 'companies' && (
            <motion.div 
              key="companies"
              className="h-full overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6 pb-8">
                {/* Фильтры */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Filter className="h-5 w-5" />
                      <span>Фильтры</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Город</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите город" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все города</SelectItem>
                            <SelectItem value="Минск">Минск</SelectItem>
                            <SelectItem value="Гомель">Гомель</SelectItem>
                            <SelectItem value="Витебск">Витебск</SelectItem>
                            <SelectItem value="Брест">Брест</SelectItem>
                            <SelectItem value="Гродно">Гродно</SelectItem>
                            <SelectItem value="Могилев">Могилев</SelectItem>
                            <SelectItem value="Пинск">Пинск</SelectItem>
                            <SelectItem value="Орша">Орша</SelectItem>
                            <SelectItem value="Бобруйск">Бобруйск</SelectItem>
                            <SelectItem value="Слуцк">Слуцк</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Вероятность аномалий</label>
                        <Select value={selectedProbabilityLevel} onValueChange={setSelectedProbabilityLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Вероятность аномалий" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все вероятности</SelectItem>
                            <SelectItem value="high">Высокая</SelectItem>
                            <SelectItem value="elevated">Повышенная</SelectItem>
                            <SelectItem value="medium">Средняя</SelectItem>
                            <SelectItem value="low">Низкая</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Поиск</label>
                        <Input placeholder="Название компании..." />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Список компаний */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Компании по вероятности аномалий</span>
                      </div>
                      <Badge variant="outline">{filteredCompanies.length} компаний</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCompanies.map((company, index) => (
                        <div 
                          key={index} 
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleAnalyticsClick({
                            type: 'probability-category',
                            value: company.probability,
                            additionalData: { company: company.name, city: company.city }
                          })}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-gray-900">{company.name}</h3>
                                <Badge className={getProbabilityBadgeColor(company.probability)}>
                                  {getProbabilityLabel(company.probability)}
                                </Badge>
                              </div>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {company.city}
                                </div>
                                <div 
                                  className="flex items-center hover:text-blue-600 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnalyticsClick({
                                      type: 'top-operations',
                                      value: company.operations,
                                      additionalData: { company: company.name }
                                    });
                                  }}
                                >
                                  <Activity className="h-4 w-4 mr-1" />
                                  {company.operations.toLocaleString()} операций
                                </div>
                                <div className="flex items-center">
                                  <Percent className="h-4 w-4 mr-1" />
                                  Вероятность: {company.probabilityScore}/10
                                </div>
                                <div 
                                  className="flex items-center hover:text-red-600 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnalyticsClick({
                                      type: 'anomaly-type',
                                      value: 'weight_anomaly',
                                      additionalData: { company: company.name }
                                    });
                                  }}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  {company.issues} нарушений
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {(company.revenue / 1000).toFixed(0)}K руб
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {company.employees} сотр.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <div className="h-full overflow-y-auto">
              <ReportsPage />
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="h-full overflow-y-auto">
              <div className="space-y-6 pb-8">
                {/* Основные показатели */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAnalyticsClick({
                      type: 'top-operations',
                      value: 'all'
                    })}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Всего вагонов</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {financeData.totalWagons.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">в системе</p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAnalyticsClick({
                      type: 'risk-level',
                      value: 'high'
                    })}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Под риском</p>
                          <p className="text-2xl font-bold text-red-600">
                            {financeData.riskWagons.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((financeData.riskWagons / financeData.totalWagons) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAnalyticsClick({
                      type: 'risk-level',
                      value: 'low'
                    })}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Безопасные</p>
                          <p className="text-2xl font-bold text-green-600">
                            {financeData.safeWagons.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((financeData.safeWagons / financeData.totalWagons) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Стоимость за вагон</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(financeData.wagonCost / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-500">рублей</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Финансовые потери и прогнозы */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span>Финансовые потери</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Максимальные потери</span>
                          <span className="font-medium text-red-600">
                            {(financeData.maxLosses / 1000000000).toFixed(1)}B руб
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Текущие потери</span>
                          <span className="font-medium text-orange-600">
                            {(financeData.currentLosses / 1000000).toFixed(1)}M руб
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Потенциальная экономия</span>
                          <span className="font-medium text-green-600">
                            {(financeData.potentialSavings / 1000000).toFixed(1)}M руб
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(financeData.currentLosses / financeData.maxLosses) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Риск реализации: {((financeData.currentLosses / financeData.maxLosses) * 100).toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span>Защита активов</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Застрахованные вагоны</span>
                          <Badge className="bg-green-100 text-green-800">
                            {((financeData.safeWagons / financeData.totalWagons) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium">Система мониторинга</span>
                          <Badge className="bg-blue-100 text-blue-800">Активна</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium">Резервный фонд</span>
                          <Badge className="bg-yellow-100 text-yellow-800">45.2M руб</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Дополнительная финансовая аналитика */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Детализированная финансовая аналитика</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Ежемесячные расходы</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Обслуживание системы</span>
                              <span className="font-medium">2.3M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Страхование</span>
                              <span className="font-medium">1.8M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Персонал</span>
                              <span className="font-medium">4.2M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">IT инфраструктура</span>
                              <span className="font-medium">1.1M руб</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-3">ROI от внедрения</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Экономия за год</span>
                              <span className="font-medium text-green-600">156.7M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Вложения</span>
                              <span className="font-medium text-red-600">45.2M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ROI</span>
                              <span className="font-medium text-blue-600">247%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Окупаемость</span>
                              <span className="font-medium">3.4 мес</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Прогноз на год</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ожидаемые потери</span>
                              <span className="font-medium text-orange-600">78.3M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Предотвращенные</span>
                              <span className="font-medium text-green-600">234.1M руб</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Эффективность</span>
                              <span className="font-medium text-blue-600">75%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Целевая экономия</span>
                              <span className="font-medium">500M руб</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="h-full overflow-y-auto">
              <div className="space-y-6 pb-8">
                {/* Ключевые индикаторы */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Ключевые индикаторы</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {forecastData.key_indicators.map((indicator, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                            <div className={cn(
                              'p-1 rounded-full',
                              indicator.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            )}>
                              {indicator.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Текущий</span>
                              <span className="font-medium">{indicator.current}{indicator.name.includes('%') ? '%' : indicator.name.includes('потери') ? 'M руб' : '%'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Прогноз 1 год</span>
                              <span className="font-medium text-blue-600">{indicator.forecast_1y}{indicator.name.includes('%') ? '%' : indicator.name.includes('потери') ? 'M руб' : '%'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Прогноз 5 лет</span>
                              <span className="font-medium text-green-600">{indicator.forecast_5y}{indicator.name.includes('%') ? '%' : indicator.name.includes('потери') ? 'M руб' : '%'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Реко��ендации */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span>Рекомендации по периодам</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {forecastData.recommendations.map((period, index) => (
                        <div key={index} className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {period.period}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {period.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'ai-stats' && (
            <motion.div 
              key="ai-stats"
              className="h-full overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6 pb-8">
                {/* Основные показатели ИИ */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Точность анализа</p>
                          <p className="text-2xl font-bold text-green-600">{aiStats.performance.accuracy}%</p>
                          <p className="text-xs text-gray-500">За последний месяц</p>
                        </div>
                        <Brain className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Уверенность</p>
                          <p className="text-2xl font-bold text-blue-600">{aiStats.performance.confidence}%</p>
                          <p className="text-xs text-gray-500">Средняя по всем моделям</p>
                        </div>
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Время ответа</p>
                          <p className="text-2xl font-bold text-purple-600">{aiStats.performance.responseTime}мс</p>
                          <p className="text-xs text-gray-500">Средний показатель</p>
                        </div>
                        <Zap className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Uptime системы</p>
                          <p className="text-2xl font-bold text-green-600">{aiStats.performance.uptime}%</p>
                          <p className="text-xs text-gray-500">За последний год</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Статистика обработки */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span>Обработка данных</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Проанализировано</span>
                        <span className="font-medium">{aiStats.performance.totalAnalyzed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Аномалий найдено</span>
                        <span className="font-medium text-red-600">{aiStats.performance.anomaliesDetected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Критических</span>
                        <span className="font-medium text-red-600">{aiStats.performance.criticalFound}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ложных срабатываний</span>
                        <span className="font-medium text-gray-600">{aiStats.performance.falsePositives}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Экономия времени</span>
                        <span className="font-medium text-green-600">{aiStats.performance.savedTime}ч</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        <span>Обучение моделей</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Активных моделей</span>
                        <span className="font-medium">{aiStats.performance.modelsActive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Наборов данных</span>
                        <span className="font-medium">{aiStats.training.datasets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Обучающих примеров</span>
                        <span className="font-medium">{aiStats.training?.totalSamples?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Последнее обучение</span>
                        <span className="font-medium">
                          {aiStats.training?.lastTraining ? new Date(aiStats.training.lastTraining).toLocaleDateString('ru-RU') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Следующее обучение</span>
                        <span className="font-medium text-blue-600">
                          {aiStats.training?.nextTraining ? new Date(aiStats.training.nextTraining).toLocaleDateString('ru-RU') : 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Модели ИИ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>Активные модели ИИ</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiStats.models.map((model, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-gray-900">{model.name}</h3>
                                <Badge className={
                                  model.status === 'active' 
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                }>
                                  {model.status === 'active' ? 'Активна' : 'Обучение'}
                                </Badge>
                              </div>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                  Точность: {model.accuracy}%
                                </div>
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-1 text-blue-500" />
                                  Обработано: {model.processed?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  Статус: {model.status === 'active' ? 'Работает' : 'Обучается'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Прогнозы и улучшения */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span>Прогноз точности</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Сегодня</span>
                        <span className="font-medium text-green-600">{aiStats.predictions.todayAccuracy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Завтра</span>
                        <span className="font-medium text-blue-600">{aiStats.predictions.tomorrowPrediction}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">На неделю</span>
                        <span className="font-medium text-purple-600">{aiStats.predictions.weekPrediction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${aiStats.predictions.todayAccuracy}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        <span>Улучшения</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Области для развития:</h4>
                        {aiStats.predictions.improvementNeeded.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            Ожидаемое улучшение точности после внедрения: +2.3%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div 
              key="performance"
              className="h-full overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6 pb-8">
                {/* Системные метрики */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigateToTable?.('/transit-table')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Всего записей</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {performanceData.systemMetrics.totalRecords.toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Точность системы</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {performanceData.systemMetrics.overallAccuracy}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <RefreshCw className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Последнее обновление</p>
                          <p className="text-lg font-bold text-gray-900">
                            {performanceData.systemMetrics.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Мониторинг производительности */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span>Мониторинг производительности</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {performanceData.monitoring.map((item, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">{item.metric}</span>
                            </div>
                            <Badge className={getMonitoringStatusColor(item.status)}>
                              {item.status === 'excellent' ? 'Отлично' : 
                               item.status === 'good' ? 'Хорошо' : 
                               item.status === 'warning' ? 'Внимание' : 'Критично'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Текущее: {item.current}{item.unit || ''}
                              </span>
                              <span className="text-gray-600">
                                Цель: {item.target}{item.unit || ''}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  getProgressColor(item.current, item.target, item.metric.includes('CPU') || item.metric.includes('памяти'))
                                }`}
                                style={{ 
                                  width: `${Math.min(100, (item.current / item.target) * 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Статистика за день */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span>Статистика за день</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {performanceData.dailyStats?.recordsProcessed?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">Записей обработано</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {performanceData.dailyStats.anomaliesDetected}
                          </p>
                          <p className="text-sm text-gray-600">Аномалий найдено</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {performanceData.dailyStats.avgProcessingTime}с
                          </p>
                          <p className="text-sm text-gray-600">Среднее время</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {performanceData.dailyStats.successRate}%
                          </p>
                          <p className="text-sm text-gray-600">Успешных операций</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Пиковая нагрузка:</span>
                          <span className="font-medium">{performanceData.dailyStats.peakLoad}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Системные ошибки:</span>
                          <span className={`font-medium ${performanceData.dailyStats.systemErrors === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {performanceData.dailyStats.systemErrors}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Быстрые действия */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-indigo-600" />
                        <span>Быстрые действия</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {performanceData.quickActions.map((action, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            className="justify-start h-auto p-4 flex items-center space-x-3 hover:bg-gray-50"
                            onClick={() => handleQuickAction(action.action)}
                          >
                            <action.icon className="h-5 w-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium">{action.label}</p>
                              <p className="text-xs text-gray-500">{action.description}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Системные ресурсы */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span>Системные ресурсы</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(229, 231, 235)" strokeWidth="8"/>
                            <circle 
                              cx="50" cy="50" r="40" fill="none" 
                              stroke="rgb(59, 130, 246)" strokeWidth="8"
                              strokeDasharray={`${performanceData.systemMetrics.cpuLoad * 2.51} 251`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{performanceData.systemMetrics.cpuLoad}%</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">CPU</p>
                        <p className="text-xs text-gray-500">Загрузка процессора</p>
                      </div>

                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(229, 231, 235)" strokeWidth="8"/>
                            <circle 
                              cx="50" cy="50" r="40" fill="none" 
                              stroke="rgb(16, 185, 129)" strokeWidth="8"
                              strokeDasharray={`${performanceData.systemMetrics.memoryUsage * 2.51} 251`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{performanceData.systemMetrics.memoryUsage}%</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">RAM</p>
                        <p className="text-xs text-gray-500">Использование памяти</p>
                      </div>

                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(229, 231, 235)" strokeWidth="8"/>
                            <circle 
                              cx="50" cy="50" r="40" fill="none" 
                              stroke="rgb(245, 158, 11)" strokeWidth="8"
                              strokeDasharray={`${performanceData.systemMetrics.diskUsage * 2.51} 251`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{performanceData.systemMetrics.diskUsage}%</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Disk</p>
                        <p className="text-xs text-gray-500">Дисковое пространство</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};