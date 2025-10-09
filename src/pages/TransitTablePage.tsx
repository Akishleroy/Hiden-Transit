// Страница с полной таблицей транзитных данных

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TransitDataTable } from '../components/tables/TransitDataTable';
import { FilterPanel } from '../components/filters/FilterPanel';

import { ImportDataModal } from '../components/modals/ImportDataModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Filter, 
  Database, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Download,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  Upload
} from 'lucide-react';
import { TransitRecord, FilterState } from '../types/transit';
import { generateMockDashboardStats } from '../services/transitApi';
import { dataService, ImportedRecord } from '../services/dataService';
import { toast } from 'sonner@2.0.3';

interface TransitTablePageProps {
  initialFilters?: FilterState;
  highlightInfo?: string;
}

export const TransitTablePage: React.FC<TransitTablePageProps> = ({ 
  initialFilters, 
  highlightInfo 
}) => {
  // Создаем начальные фильтры, используя переданные или дефолтные
  const getInitialFilters = (): FilterState => {
    if (initialFilters) {
      return initialFilters;
    }
    
    return {
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
      date_filter: {
        preset: 'month'
      },
      geography_filter: {
        departure_countries: [],
        destination_countries: [],
        stations: []
      },
      cargo_filter: {
        cargo_types: []
      },
      quick_filters: {
        only_anomalies: false,
        critical_only: false,
        high_probability_only: false,
        recent_only: false
      }
    };
  };

  // Состояние фильтров
  const [filters, setFilters] = useState<FilterState>(getInitialFilters());

  // Обновляем фильтры при изменении initialFilters
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Состояние интерфейса
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showStatistics, setShowStatistics] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [totalRecords, setTotalRecords] = useState(728904);
  const [importedStats, setImportedStats] = useState({ high: 3832, elevated: 225, medium: 1799, low: 18406 });
  
  // Подписываемся на изменения данных
  useEffect(() => {
    // Инициализируем статистику
    const stats = dataService.getAnomalyStats();
    if (stats.total > 0) {
      setImportedStats({
        high: stats.high,
        elevated: stats.elevated,
        medium: stats.medium,
        low: stats.low
      });
      setTotalRecords(stats.total);
    }

    // Подписываемся на изменения
    const unsubscribe = dataService.subscribe((data) => {
      const newStats = dataService.getAnomalyStats();
      setImportedStats({
        high: newStats.high,
        elevated: newStats.elevated,
        medium: newStats.medium,
        low: newStats.low
      });
      setTotalRecords(newStats.total);
    });

    return unsubscribe;
  }, []);
  
  // Обработчики
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
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
      date_filter: {
        preset: 'month'
      },
      geography_filter: {
        departure_countries: [],
        destination_countries: [],
        stations: []
      },
      cargo_filter: {
        cargo_types: []
      },
      quick_filters: {
        only_anomalies: false,
        critical_only: false,
        high_probability_only: false,
        recent_only: false
      }
    });
  };

  const handleRecordClick = (record: TransitRecord) => {
    // Модальное окно убрано - больше не открываем детали
    console.log('Clicked record:', record);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleImportComplete = (data: any[], mode: 'replace' | 'append') => {
    try {
      // Применяем данные через dataService
      if (mode === 'replace') {
        dataService.replaceData(data);
      } else {
        dataService.appendData(data);
      }

      // Обновляем статистику
      const newStats = dataService.getAnomalyStats();
      setImportedStats({
        high: newStats.high,
        elevated: newStats.elevated,
        medium: newStats.medium,
        low: newStats.low
      });
      
      setTotalRecords(dataService.getCount());
      setLastUpdated(new Date());
      setIsImportModalOpen(false);

      // Уведомляем об успешном импорте
      console.log('Импорт завершен успешно:', {
        mode,
        recordsCount: data.length,
        totalRecords: dataService.getCount()
      });

    } catch (error) {
      console.error('Ошибка применения импортированных данных:', error);
      toast.error('Ошибка применения данных');
    }
  };

  // Обработчик клика по карточкам вероятностей
  const handleProbabilityClick = (probability: 'high' | 'elevated' | 'medium' | 'low') => {
    const newFilters = { ...filters };
    
    // Сбрасываем все фильтры вероятностей
    newFilters.probability_filter = {
      high: false,
      elevated: false,
      medium: false,
      low: false
    };
    
    // Активируем выбранную вероятность
    newFilters.probability_filter[probability] = true;
    
    setFilters(newFilters);
    toast.success(`Применён фильтр: ${
      probability === 'high' ? 'Высокая вероятность' :
      probability === 'elevated' ? 'Повышенная вероятность' :
      probability === 'medium' ? 'Средняя вероятность' :
      'Низкая вероятность'
    }`);
  };

  // Подсчет активных фильтров
  const getActiveFiltersCount = (): number => {
    let count = 0;
    
    if (filters.quick_filters) {
      count += Object.values(filters.quick_filters).filter(Boolean).length;
    }
    
    if (filters.probability_filter) {
      count += Object.values(filters.probability_filter).filter(Boolean).length;
    }
    
    if (filters.risk_filter) {
      count += Object.values(filters.risk_filter).filter(Boolean).length;
    }
    
    if (filters.anomaly_filter) {
      count += Object.values(filters.anomaly_filter).filter(Boolean).length;
    }
    
    return count;
  };

  return (
    <div className="h-full flex flex-col page-container">
      {/* Заголовок страницы - фиксированный */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Транзитные операции
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Полная база данных транзитных операций с анализом аномалий и вероятностей
            </p>
            {/* Показываем информацию о примененных фильтрах */}
            {highlightInfo && (
              <div className="mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Filter className="w-3 h-3 mr-1" />
                  {highlightInfo}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Обновлено: {lastUpdated.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Upload className="w-4 h-4" />
              Импорт
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Обновить
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Статистика - компактная и фиксированная */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-shrink-0 p-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-red-50 hover:border-red-200"
            onClick={() => handleProbabilityClick('high')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Высокая вероятность</p>
                  <p className="text-xl font-bold text-red-600">{importedStats.high.toLocaleString('ru-RU')}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-orange-50 hover:border-orange-200"
            onClick={() => handleProbabilityClick('elevated')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Повышенная вероятность</p>
                  <p className="text-xl font-bold text-orange-600">{importedStats.elevated.toLocaleString('ru-RU')}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-yellow-50 hover:border-yellow-200"
            onClick={() => handleProbabilityClick('medium')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Средняя вероятность</p>
                  <p className="text-xl font-bold text-yellow-600">{importedStats.medium.toLocaleString('ru-RU')}</p>
                </div>
                <Info className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-blue-50 hover:border-blue-200"
            onClick={() => handleProbabilityClick('low')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Низкая вероятность</p>
                  <p className="text-xl font-bold text-blue-600">{importedStats.low.toLocaleString('ru-RU')}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Всего записей</p>
                  <p className="text-xl font-bold text-green-600">{"4 410 695"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">База знаний</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Основная область с таблицей - занимает всё оставшееся место */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex-1 flex min-h-0 px-6 pb-6"
      >
        {/* Контейнер таблицы с интегрированной панелью фильтров */}
        <div className="flex-1 min-w-0 min-h-0 flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          {/* Панель фильтров - прикреплена к левой стороне таблицы */}
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
            isOpen={isFilterPanelOpen}
            onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex-shrink-0 border-r-0"
          />

          {/* Основная область контента - таблица займет всё доступное место */}
          <div className="flex-1 min-w-0 min-h-0">
            <TransitDataTable
              filters={filters}
              onRecordClick={handleRecordClick}
              onFiltersToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="h-full border-0 rounded-none"
            />
          </div>
        </div>
      </motion.div>



      {/* Модальное окно импорта данных */}
      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Индикатор активных фильтров */}
      {getActiveFiltersCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Filter className="w-4 h-4" />
                <span>Активных фильтров: {getActiveFiltersCount()}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};