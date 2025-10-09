// Централизованные статические данные для Gray Tranzit
// Этот файл содержит все статические данные приложения
// Для подключения бэкенда просто замените эти данные на API-вызовы

import { 
  AlertTriangle, 
  Clock, 
  Route, 
  Copy,
  Eye,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  Info,
  CheckCircle,
  Users,
  TrendingUp,
  FileText,
  Download,
  Upload,
  Database,
  Globe,
  Settings,
  Shield,
  Zap,
  Target,
  Layers,
  Filter,
  Search,
  Calendar,
  Map,
  Truck,
  Package,
  DollarSign
} from 'lucide-react';

// ===== ОСНОВНАЯ СТАТИСТИКА СИСТЕМЫ =====
export const SYSTEM_STATS = {
  totalRecords: 728904,
  todayOperations: 2847,
  weekOperations: 18453,
  uptime: 99.8,
  responseTime: 2.3,
  weightAnomalies: 8734,
  timeAnomalies: 12456,
  routeAnomalies: 6892,
  duplicates: 4612,
  activeSessions: 142,
  totalUsers: 89,
  lastUpdate: new Date().toISOString()
};

// ===== ДАННЫЕ ДЛЯ DASHBOARD - ВЕРОЯТНОСТИ =====
export const PROBABILITY_DATA = [
  { 
    id: 'high_probability',
    title: 'Высокая вероятность', 
    value: 3832, 
    percentage: 0.18,
    colorClass: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-red-700 dark:text-red-300',
    boldColor: 'text-red-800 dark:text-red-200',
    descColor: 'text-red-600 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
    description: 'Станция назначения,Вес вагона,Номер вагона,Код Груза', 
    tooltip: 'Операции с высокой степенью соответствия всем параметрам и минимальными отклонениями',
    icon: AlertTriangle,
    probability: 'high',
    trend: 'up',
    changePercent: 12.5
  },
  { 
    id: 'elevated_probability',
    title: 'Повышенная вероятность', 
    value: 225, 
    percentage: 8.08,
    colorClass: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-orange-700 dark:text-orange-300',
    boldColor: 'text-orange-800 dark:text-orange-200',
    descColor: 'text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
    description: 'Станция назначения,Номер вагона,Код Груза', 
    tooltip: 'Операции с незначительными отклонениями, но в целом соответствующие стандартам',
    icon: AlertCircle,
    probability: 'elevated',
    trend: 'up',
    changePercent: 8.2
  },
  { 
    id: 'medium_probability',
    title: 'Средняя вероятность', 
    value: 1799, 
    percentage: 17.09,
    colorClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-800/40 dark:hover:to-yellow-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    boldColor: 'text-yellow-800 dark:text-yellow-200',
    descColor: 'text-yellow-600 dark:text-yellow-400',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Грузополучатель=Грузоотпровитель,Номер вагона,Код Груза', 
    tooltip: 'Операции с умеренными отклонениями, требующие внимания',
    icon: Info,
    probability: 'medium',
    trend: 'down',
    changePercent: -3.1
  },
  { 
    id: 'low_probability',
    title: 'Низкая вероятность', 
    value: 18406, 
    percentage: 34.51,
    colorClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-blue-700 dark:text-blue-300',
    boldColor: 'text-blue-800 dark:text-blue-200',
    descColor: 'text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Номер вагона,Код Груза', 
    tooltip: 'Операции с значительными отклонениями, требующие проверки',
    icon: CheckCircle,
    probability: 'low',
    trend: 'down',
    changePercent: -5.7
  }
];

// ===== ДАННЫЕ ДЛЯ DASHBOARD - АНОМАЛИИ =====
export const ANOMALY_DATA = [
  { 
    id: 'weight_anomalies',
    title: 'Весовые аномалии', 
    value: 8734, 
    percentage: 11.98,
    colorClass: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-red-700 dark:text-red-300',
    boldColor: 'text-red-800 dark:text-red-200',
    descColor: 'text-red-600 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
    description: 'Критические отклонения веса', 
    tooltip: 'Весовые аномалии - отклонения в весе груза между импортом и экспортом',
    icon: AlertTriangle,
    anomalyType: 'weight',
    severity: 'high',
    trend: 'up',
    changePercent: 15.3
  },
  { 
    id: 'time_anomalies',
    title: 'Временные аномалии', 
    value: 12456, 
    percentage: 17.09,
    colorClass: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-orange-700 dark:text-orange-300',
    boldColor: 'text-orange-800 dark:text-orange-200',
    descColor: 'text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
    description: 'Нарушения временных интервалов', 
    tooltip: 'Временные аномалии - нестандартные временные интервалы между операциями',
    icon: Clock,
    anomalyType: 'time',
    severity: 'medium',
    trend: 'up',
    changePercent: 7.8
  },
  { 
    id: 'route_anomalies',
    title: 'Маршрутные аномалии', 
    value: 6892, 
    percentage: 9.46,
    colorClass: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-800/40 dark:hover:to-yellow-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    boldColor: 'text-yellow-800 dark:text-yellow-200',
    descColor: 'text-yellow-600 dark:text-yellow-400',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Отклонения от плановых маршрутов', 
    tooltip: 'Маршрутные аномалии - отклонения в логике маршрута или станций',
    icon: Route,
    anomalyType: 'route',
    severity: 'medium',
    trend: 'down',
    changePercent: -2.1
  },
  { 
    id: 'duplicate_anomalies',
    title: 'Дубликаты операций', 
    value: 4612, 
    percentage: 6.33,
    colorClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 cursor-pointer transition-all duration-200',
    textColor: 'text-blue-700 dark:text-blue-300',
    boldColor: 'text-blue-800 dark:text-blue-200',
    descColor: 'text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Повторяющиеся записи', 
    tooltip: 'Дубликаты операций - обнаружены повторяющиеся или схожие операции',
    icon: Copy,
    anomalyType: 'duplicate',
    severity: 'low',
    trend: 'down',
    changePercent: -12.4
  }
];

// ===== КРИТИЧЕСКИЕ АНОМАЛИИ =====
export const CRITICAL_ANOMALIES = [
  {
    id: 'anom_001',
    type: 'weight',
    severity: 'critical',
    title: 'Критическое отклонение веса',
    description: 'Компания "КазТрансЛогистик" ТОО: обнаружено критическое отклонение веса груза на 847% от заявленного. Операция требует немедленной проверки.',
    details: {
      operationId: 'TR-2024-089453',
      timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      declaredWeight: 12500,
      actualWeight: 118375,
      deviation: 847.0,
      station: 'Алматы-1',
      cargoType: 'Металлопродукция',
      company: 'КазТрансЛогистик ТОО',
      cost: '4 567 000 тг'
    }
  },
  {
    id: 'anom_002',
    type: 'time',
    severity: 'high',
    title: 'Аномальная задержка транзита',
    description: 'Компания "АстанаГрузПеревозки" ТОО: груз находится в транзите 18 дней при плановом времени 3 дня. Возможна потеря груза.',
    details: {
      operationId: 'TR-2024-089401',
      timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
      plannedDays: 3,
      actualDays: 18,
      lastStation: 'Шымкент',
      destination: 'Ташкент',
      cargoType: 'Продовольственные товары',
      company: 'АстанаГрузПеревозки ТОО',
      cost: '2 340 000 тг'
    }
  },
  {
    id: 'anom_003',
    type: 'route',
    severity: 'high',
    title: 'Отклонение от маршрута',
    description: 'Компания "АлматыТрейдинг" ТОО: груз проследовал через неавторизованную станцию. Нарушение плана перевозки.',
    details: {
      operationId: 'TR-2024-089378',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      plannedRoute: 'Алматы → Шымкент → Ташкент',
      actualRoute: 'Алматы → Туркестан → Шымкент → Ташкент',
      unauthorizedStation: 'Туркестан',
      cargoType: 'Химическая продукция',
      company: 'АлматыТрейдинг ТОО',
      cost: '3 890 000 тг'
    }
  },
  {
    id: 'anom_004',
    type: 'duplicate',
    severity: 'medium',
    title: 'Возможный дубликат записи',
    description: 'Компания "ШымкентЛогистика" ТОО: обнаружена операция с идентичными параметрами, выполненная 2 часа назад.',
    details: {
      operationId: 'TR-2024-089455',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      duplicateId: 'TR-2024-089443',
      similarity: 98.7,
      matchingFields: ['weight', 'cargoType', 'route', 'sender'],
      cargoType: 'Зерновые культуры',
      company: 'ШымкентЛогистика ТОО',
      cost: '1 567 000 тг'
    }
  },
  {
    id: 'anom_005',
    type: 'weight',
    severity: 'medium',
    title: 'Подозрительное изменение веса',
    description: 'Компания "АктобеКарго" ТОО: вес груза изменился на 15% между станциями без объективных причин.',
    details: {
      operationId: 'TR-2024-089429',
      timestamp: new Date(Date.now() - 3.7 * 60 * 60 * 1000).toISOString(),
      initialWeight: 24800,
      currentWeight: 21320,
      deviation: -14.0,
      station: 'Отрар',
      cargoType: 'Строительные материалы',
      company: 'АктобеКарго ТОО',
      cost: '987 000 тг'
    }
  }
];

// ===== ДАННЫЕ ВРЕМЕННОЙ ШКАЛЫ =====
export const TIMELINE_DATA = [
  { date: '2024-01-01', high: 45, elevated: 156, medium: 423, low: 678, weight: 234, time: 345, route: 189, duplicate: 123 },
  { date: '2024-01-02', high: 52, elevated: 167, medium: 445, low: 698, weight: 245, time: 378, route: 201, duplicate: 134 },
  { date: '2024-01-03', high: 48, elevated: 145, medium: 398, low: 645, weight: 223, time: 334, route: 178, duplicate: 118 },
  { date: '2024-01-04', high: 61, elevated: 178, medium: 467, low: 712, weight: 267, time: 389, route: 234, duplicate: 145 },
  { date: '2024-01-05', high: 55, elevated: 162, medium: 434, low: 689, weight: 251, time: 356, route: 198, duplicate: 129 },
  { date: '2024-01-06', high: 49, elevated: 154, medium: 412, low: 667, weight: 238, time: 345, route: 187, duplicate: 122 },
  { date: '2024-01-07', high: 58, elevated: 171, medium: 458, low: 701, weight: 259, time: 371, route: 213, duplicate: 138 },
  { date: '2024-01-08', high: 63, elevated: 183, medium: 479, low: 734, weight: 278, time: 394, route: 245, duplicate: 152 },
  { date: '2024-01-09', high: 57, elevated: 169, medium: 445, low: 695, weight: 254, time: 367, route: 204, duplicate: 135 },
  { date: '2024-01-10', high: 51, elevated: 158, medium: 421, low: 673, weight: 242, time: 351, route: 189, duplicate: 125 },
  { date: '2024-01-11', high: 66, elevated: 187, medium: 492, low: 748, weight: 289, time: 405, route: 267, duplicate: 158 },
  { date: '2024-01-12', high: 59, elevated: 174, medium: 464, low: 709, weight: 265, time: 378, route: 221, duplicate: 142 },
  { date: '2024-01-13', high: 54, elevated: 163, medium: 438, low: 682, weight: 248, time: 359, route: 195, duplicate: 131 },
  { date: '2024-01-14', high: 62, elevated: 181, medium: 475, low: 721, weight: 274, time: 387, route: 238, duplicate: 149 }
];

// ===== БЫСТРЫЙ ДОСТУП =====
export const QUICK_ACCESS_ITEMS = [
  {
    id: 'knowledge_base',
    title: 'База знаний',
    description: 'Таблица операций',
    icon: Eye,
    iconColor: 'text-blue-600',
    hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    tooltip: 'Просмотр подробной таблицы всех транзитных операций с возможностью фильтрации и анализа',
    path: '/transit-table'
  },
  {
    id: 'ai_assistant',
    title: 'AI Ассистент',
    description: 'Умный анализ',
    icon: Activity,
    iconColor: 'text-green-600',
    hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    tooltip: 'Интеллектуальный помощник для анализа данных и получения ответов на вопросы',
    path: '/chat'
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Производительность',
    icon: PieChart,
    iconColor: 'text-purple-600',
    hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
    tooltip: 'Подробная аналитика производительности системы и метрики эффективности',
    path: '/analytics',
    activeTab: 'performance'
  },
  {
    id: 'reports',
    title: 'Отчеты',
    description: 'Статистика',
    icon: BarChart3,
    iconColor: 'text-orange-600',
    hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
    tooltip: 'Статистические отчеты и визуализация данных транзитных операций',
    path: '/analytics',
    activeTab: 'reports'
  }
];

// ===== НАВИГАЦИОННОЕ МЕНЮ =====
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    title: 'Главная',
    icon: BarChart3,
    path: '/',
    badge: null,
    description: 'Обзор системы и основная статистика'
  },
  {
    id: 'transit_table',
    title: 'База знаний',
    icon: Eye,
    path: '/transit-table',
    badge: '728K+',
    description: 'Таблица транзитных операций'
  },
  {
    id: 'chat',
    title: 'AI Ассистент',
    icon: Activity,
    path: '/chat',
    badge: 'AI',
    description: 'Интеллектуальный помощник'
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    icon: PieChart,
    path: '/analytics',
    badge: null,
    description: 'Детальная аналитика и отчеты'
  }
];

// ===== СТРАНЫ И РЕГИОНЫ =====
export const COUNTRIES_DATA = [
  { code: 'KZ', name: 'Казахстан', nameEn: 'Kazakhstan', flag: '🇰🇿', operationsCount: 342456 },
  { code: 'UZ', name: 'Узбекистан', nameEn: 'Uzbekistan', flag: '🇺🇿', operationsCount: 189234 },
  { code: 'KG', name: 'Кыргызстан', nameEn: 'Kyrgyzstan', flag: '🇰🇬', operationsCount: 97123 },
  { code: 'TJ', name: 'Таджикистан', nameEn: 'Tajikistan', flag: '🇹🇯', operationsCount: 67892 },
  { code: 'TM', name: 'Туркменистан', nameEn: 'Turkmenistan', flag: '🇹🇲', operationsCount: 32199 },
  { code: 'RU', name: 'Россия', nameEn: 'Russia', flag: '🇷🇺', operationsCount: 156789 },
  { code: 'CN', name: 'Китай', nameEn: 'China', flag: '🇨🇳', operationsCount: 234567 },
  { code: 'IR', name: 'Иран', nameEn: 'Iran', flag: '🇮🇷', operationsCount: 87432 },
  { code: 'AF', name: 'Афганистан', nameEn: 'Afghanistan', flag: '🇦🇫', operationsCount: 23451 }
];

// ===== ТИПЫ ГРУЗОВ =====
export const CARGO_TYPES = [
  { id: 'grain', name: 'Зерновые культуры', icon: '🌾', count: 156789, percentage: 21.5 },
  { id: 'metals', name: 'Металлопродукция', icon: '🔩', count: 134567, percentage: 18.5 },
  { id: 'oil_products', name: 'Нефтепродукты', icon: '🛢️', count: 123456, percentage: 16.9 },
  { id: 'chemicals', name: 'Химическая продукция', icon: '🧪', count: 98765, percentage: 13.5 },
  { id: 'construction', name: 'Строительные материалы', icon: '🧱', count: 87654, percentage: 12.0 },
  { id: 'food', name: 'Продовольственные товары', icon: '🍎', count: 76543, percentage: 10.5 },
  { id: 'textiles', name: 'Текстиль и одежда', icon: '👕', count: 32109, percentage: 4.4 },
  { id: 'machinery', name: 'Машины и оборудование', icon: '⚙️', count: 19876, percentage: 2.7 }
];

// ===== ЖЕЛЕЗНОДОРОЖНЫЕ СТАНЦИИ =====
export const RAILWAY_STATIONS = [
  { id: 'almaty_1', name: 'Алматы-1', country: 'KZ', operations: 89234, type: 'major' },
  { id: 'nur_sultan', name: 'Нур-Султан', country: 'KZ', operations: 76543, type: 'major' },
  { id: 'shymkent', name: 'Шымкент', country: 'KZ', operations: 65432, type: 'major' },
  { id: 'aktobe', name: 'Актобе', country: 'KZ', operations: 54321, type: 'medium' },
  { id: 'tashkent', name: 'Ташкент', country: 'UZ', operations: 87654, type: 'major' },
  { id: 'samarkand', name: 'Самарканд', country: 'UZ', operations: 43210, type: 'medium' },
  { id: 'bukhara', name: 'Бухара', country: 'UZ', operations: 32109, type: 'medium' },
  { id: 'bishkek', name: 'Бишкек', country: 'KG', operations: 34567, type: 'medium' },
  { id: 'osh', name: 'Ош', country: 'KG', operations: 23456, type: 'minor' },
  { id: 'dushanbe', name: 'Душанбе', country: 'TJ', operations: 28765, type: 'medium' },
  { id: 'ashgabat', name: 'Ашхабад', country: 'TM', operations: 19876, type: 'medium' }
];

// ===== ДАННЫЕ ДЛЯ АНАЛИТИКИ =====
export const ANALYTICS_DATA = {
  // Общие метрики производительности
  performance: {
    throughput: {
      current: 2847,
      target: 3000,
      percentage: 94.9,
      trend: 'up',
      change: 8.5
    },
    efficiency: {
      current: 89.7,
      target: 92.0,
      percentage: 97.5,
      trend: 'up',
      change: 3.2
    },
    errorRate: {
      current: 0.8,
      target: 0.5,
      percentage: 160.0,
      trend: 'down',
      change: -12.3
    },
    avgProcessingTime: {
      current: 4.2,
      target: 3.5,
      unit: 'часов',
      percentage: 120.0,
      trend: 'down',
      change: -15.7
    }
  },
  
  // Географическое распределение
  geographic: {
    totalCountries: 9,
    activeRoutes: 47,
    busyRoutes: [
      { from: 'Алматы', to: 'Ташкент', operations: 12456, percentage: 17.1, revenue: '45 670 000 тг' },
      { from: 'Шымкент', to: 'Самарканд', operations: 9876, percentage: 13.5, revenue: '34 230 000 тг' },
      { from: 'Нур-Султан', to: 'Урумчи', operations: 8765, percentage: 12.0, revenue: '52 340 000 тг' },
      { from: 'Актобе', to: 'Бишкек', operations: 7654, percentage: 10.5, revenue: '28 900 000 тг' },
      { from: 'Шымкент', to: 'Душанбе', operations: 6543, percentage: 9.0, revenue: '23 450 000 тг' }
    ]
  },
  
  // Финансовые показатели
  financial: {
    totalRevenue: 145780000, // в тенге
    averageOperationCost: 89500, // в тенге
    profitMargin: 23.7,
    costEfficiency: 91.3,
    monthlyGrowth: 12.8,
    currency: 'тг'
  },
  
  // Операционные показатели
  operations: {
    totalOperations: 728904,
    successfulOperations: 723892,
    failedOperations: 5012,
    successRate: 99.31,
    averageDeliveryTime: 4.2,
    onTimeDelivery: 89.7
  }
};

// ===== ЧАТЫ AI АССИСТЕНТА =====
export const CHAT_SESSIONS = [
  {
    id: 'session_001',
    title: 'Анализ аномалий за неделю',
    preview: 'Какие основные типы аномалий были обнаружены на прошлой неделе?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messageCount: 12,
    isActive: true
  },
  {
    id: 'session_002',
    title: 'Оптимизация маршрутов',
    preview: 'Предложи варианты оптимизации для маршрута Алматы-Ташкент',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    messageCount: 8,
    isActive: false
  },
  {
    id: 'session_003',
    title: 'Статистика по грузоперевозкам',
    preview: 'Сколько операций было выполнено в декабре?',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messageCount: 15,
    isActive: false
  },
  {
    id: 'session_004',
    title: 'Прогноз на следующий квартал',
    preview: 'Какой ожидается объем перевозок в Q2 2024?',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    messageCount: 6,
    isActive: false
  }
];

// ===== ПРЕДУСТАНОВЛЕННЫЕ ВОПРОСЫ ДЛЯ AI =====
export const PRESET_QUESTIONS = [
  {
    id: 'anomalies_analysis',
    category: 'Аномалии',
    question: 'Проанализируй критические аномалии за последние 7 дней',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    id: 'performance_metrics',
    category: 'Производительность',
    question: 'Покажи основные метрики производительности системы',
    icon: TrendingUp,
    color: 'text-blue-600'
  },
  {
    id: 'route_optimization',
    category: 'Маршруты',
    question: 'Какие маршруты нуждаются в оптимизации?',
    icon: Route,
    color: 'text-green-600'
  },
  {
    id: 'financial_report',
    category: 'Финансы',
    question: 'Сформируй финансовый отчет за текущий месяц',
    icon: DollarSign,
    color: 'text-purple-600'
  },
  {
    id: 'cargo_statistics',
    category: 'Грузы',
    question: 'Статистика по типам грузов в текущем году',
    icon: Package,
    color: 'text-orange-600'
  },
  {
    id: 'geographic_analysis',
    category: 'География',
    question: 'Анализ географического распределения операций',
    icon: Globe,
    color: 'text-indigo-600'
  }
];

// ===== СИСТЕМНЫЕ УВЕДОМЛЕНИЯ =====
export const SYSTEM_NOTIFICATIONS = [
  {
    id: 'notif_001',
    type: 'warning',
    title: 'Высокая загрузка системы',
    message: 'Текущая загрузка системы составляет 89%. Рекомендуется мониторинг.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high'
  },
  {
    id: 'notif_002',
    type: 'info',
    title: 'Обновление данных завершено',
    message: 'Успешно обработано 2,847 новых операций за последние 4 часа.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium'
  },
  {
    id: 'notif_003',
    type: 'success',
    title: 'Плановое обслуживание',
    message: 'Плановое обслуживание системы запланировано на 03:00-05:00 завтра.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'low'
  }
];

// ===== ПОЛЬЗОВАТЕЛИ И РОЛИ =====
export const USER_ROLES = [
  { id: 'admin', name: 'Администратор', permissions: ['all'] },
  { id: 'analyst', name: 'Аналитик', permissions: ['read', 'analyze', 'report'] },
  { id: 'operator', name: 'Оператор', permissions: ['read', 'monitor'] },
  { id: 'viewer', name: 'Наблюдатель', permissions: ['read'] }
];

export const SAMPLE_USERS = [
  {
    id: 'user_001',
    username: 'beka',
    name: 'Бекзат Алимов',
    role: 'admin',
    avatar: null,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    company: 'Казахстанские железные дороги',
    position: 'Главный аналитик системы'
  },
  {
    id: 'user_002', 
    username: 'analyst1',
    name: 'Айгуль Нурманова',
    role: 'analyst',
    avatar: null,
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    company: 'КТЖ-Грузовые перевозки',
    position: 'Ведущий аналитик'
  },
  {
    id: 'user_003',
    username: 'operator1',
    name: 'Нурлан Сарсенов',
    role: 'operator',
    avatar: null,
    lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    company: 'КазТрансСервис',
    position: 'Оператор мониторинга'
  }
];

// ===== КОНФИГУРАЦИЯ ФИЛЬТРОВ =====
export const FILTER_CONFIGS = {
  datePresets: [
    { id: 'today', name: 'Сегодня', days: 0 },
    { id: 'week', name: 'Неделя', days: 7 },
    { id: 'month', name: 'Месяц', days: 30 },
    { id: 'quarter', name: 'Квартал', days: 90 },
    { id: 'year', name: 'Год', days: 365 },
    { id: 'custom', name: 'Настроить', days: null }
  ],
  
  sortOptions: [
    { id: 'date_desc', name: 'По дате (новые)', field: 'timestamp', order: 'desc' },
    { id: 'date_asc', name: 'По дате (старые)', field: 'timestamp', order: 'asc' },
    { id: 'weight_desc', name: 'По весу (больше)', field: 'weight', order: 'desc' },
    { id: 'weight_asc', name: 'По весу (меньше)', field: 'weight', order: 'asc' },
    { id: 'probability_desc', name: 'По вероятности (высокая)', field: 'probability', order: 'desc' },
    { id: 'probability_asc', name: 'По вероятности (низкая)', field: 'probability', order: 'asc' }
  ]
};

// ===== КАЗАХСТАНСКИЕ КОМПАНИИ =====
export const KAZAKHSTAN_COMPANIES = [
  { id: 'ktl', name: 'КазТрансЛогистик ТОО', bin: '123456789012', operationsCount: 15674, totalValue: '234 567 000 тг' },
  { id: 'agp', name: 'АстанаГрузПеревозки ТОО', bin: '234567890123', operationsCount: 12893, totalValue: '189 234 000 тг' },
  { id: 'at', name: 'АлматыТрейдинг ТОО', bin: '345678901234', operationsCount: 9876, totalValue: '156 789 000 тг' },
  { id: 'sl', name: 'ШымкентЛогистика ТОО', bin: '456789012345', operationsCount: 8765, totalValue: '123 456 000 тг' },
  { id: 'ak', name: 'АктобеКарго ТОО', bin: '567890123456', operationsCount: 7654, totalValue: '98 765 000 тг' },
  { id: 'ke', name: 'КазЭкспресс ТОО', bin: '678901234567', operationsCount: 6543, totalValue: '87 654 000 тг' },
  { id: 'ats', name: 'АлматыТрансСервис ТОО', bin: '789012345678', operationsCount: 5432, totalValue: '76 543 000 тг' },
  { id: 'ngl', name: 'НурСултанГрузЛайн ТОО', bin: '890123456789', operationsCount: 4321, totalValue: '65 432 000 тг' },
  { id: 'kts', name: 'КазТрансСервис ТОО', bin: '901234567890', operationsCount: 3210, totalValue: '54 321 000 тг' },
  { id: 'akl', name: 'АктауКарго ТОО', bin: '012345678901', operationsCount: 2109, totalValue: '43 210 000 тг' }
];

// ===== ЭКСПОРТ ВСЕХ ДАННЫХ =====
export const STATIC_DATA = {
  systemStats: SYSTEM_STATS,
  probabilityData: PROBABILITY_DATA,
  anomalyData: ANOMALY_DATA,
  criticalAnomalies: CRITICAL_ANOMALIES,
  timelineData: TIMELINE_DATA,
  quickAccessItems: QUICK_ACCESS_ITEMS,
  navigationItems: NAVIGATION_ITEMS,
  countriesData: COUNTRIES_DATA,
  cargoTypes: CARGO_TYPES,
  railwayStations: RAILWAY_STATIONS,
  analyticsData: ANALYTICS_DATA,
  chatSessions: CHAT_SESSIONS,
  presetQuestions: PRESET_QUESTIONS,
  systemNotifications: SYSTEM_NOTIFICATIONS,
  userRoles: USER_ROLES,
  sampleUsers: SAMPLE_USERS,
  filterConfigs: FILTER_CONFIGS,
  kazakhstanCompanies: KAZAKHSTAN_COMPANIES
};

export const APP_CONSTANTS = {
  APP_NAME: 'Gray Tranzit',
  VERSION: '2.0.0',
  DEFAULT_THEME: 'light',
  DEFAULT_LANGUAGE: 'ru',
  CURRENCY: 'тг',
  CURRENCY_FULL: 'Казахстанский тенге',
  DATE_FORMAT: 'DD.MM.YYYY',
  TIME_FORMAT: 'HH:mm',
  PAGINATION_SIZE: 50,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FILE_TYPES: ['.csv', '.xlsx', '.xls'],
  AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 минут
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
  API_TIMEOUT: 30000, // 30 секунд
  WEBSOCKET_RECONNECT_INTERVAL: 5000, // 5 секунд
  MAIN_COUNTRIES: ['Казахстан', 'Узбекистан', 'Кыргызстан', 'Таджикистан', 'Китай'],
  PRIMARY_ROUTES: ['Алматы-Ташкент', 'Шымкент-Самарканд', 'Нур-Султан-Урумчи', 'Актобе-Бишкек']
};

export default STATIC_DATA;