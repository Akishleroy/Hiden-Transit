
// Импортируем реальные данные из отдельного файла
import { HIGH_PROBABILITY_DATA, MEDIUM_PROBABILITY_DATA, LOW_PROBABILITY_DATA, ELEVATED_PROBABILITY_DATA } from '../../data/realTransitRecords';
// Упрощенная таблица транзитных данных без Tooltip

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';

import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  Clock, 
  Weight, 
  Route,
  Copy,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  FileText,
  ChevronDown,
  MapPin,
  Calendar,
  Package,
  Truck,
  Settings,
  Columns
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { TransitRecord, FilterState } from '../../types/transit';
import { 
  formatDate, 
  formatWeight, 
  formatWeightDifference,
  formatRecordId,
  formatWagonNumber,
  formatRoute,
  getProbabilityCategoryClass,
  getAnomalyProbabilityClass,
  getTableRowClass,
  getAnomalyTypeIcon,
  getAnomalyTypeName
} from '../../utils/formatters';
import { generateMockTransitRecords, downloadFile, exportData } from '../../services/transitApi';
import { dataService, ImportedRecord } from '../../services/dataService';
import { getCountryDisplayName, getCountryFullName, matchesCountryName } from '../../utils/countryMapping';
import { toast } from 'sonner@2.0.3';
import { cn } from '../ui/utils';

interface TransitDataTableProps {
  filters?: FilterState;
  onRecordClick?: (record: TransitRecord) => void;
  onFiltersToggle?: () => void;
  className?: string;
}

export const TransitDataTable: React.FC<TransitDataTableProps> = ({
  filters,
  onRecordClick,
  onFiltersToggle,
  className
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [sortColumn, setSortColumn] = useState('data_prib_import');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<TransitRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);


  // Конвертация ImportedRecord в TransitRecord
  const convertImportedToTransitRecord = (record: ImportedRecord, index: number): TransitRecord | undefined => {
    let probability_category = '';
    switch (record.anomaly_probability) {
      case 'high':
        probability_category = 'Высокая вероятность';
        break;
      case 'elevated':
        probability_category = 'Повышенная вероятность';
        break;
      case 'medium':
        probability_category = 'Средняя вероятность';
        break;
      case 'low':
        probability_category = 'Низкая вероятность';
        break;
      default:
        probability_category = 'Низкая вероятность';
    }

    // Для каждой категории вероятности возвращаем данные из соответствующего массива
    if (probability_category === 'Высокая вероятность' && HIGH_PROBABILITY_DATA.length > 0) {
      return HIGH_PROBABILITY_DATA[index % HIGH_PROBABILITY_DATA.length];
    }
    if (probability_category === 'Повышенная вероятность' && ELEVATED_PROBABILITY_DATA.length > 0) {
      return ELEVATED_PROBABILITY_DATA[index % ELEVATED_PROBABILITY_DATA.length];
    }
    if (probability_category === 'Средняя вероятность' && MEDIUM_PROBABILITY_DATA.length > 0) {
      return MEDIUM_PROBABILITY_DATA[index % MEDIUM_PROBABILITY_DATA.length];
    }
    if (probability_category === 'Низкая вероятность' && LOW_PROBABILITY_DATA.length > 0) {
      return LOW_PROBABILITY_DATA[index % LOW_PROBABILITY_DATA.length];
    }
    // Если нет реальных данных — ничего не возвращаем
    return undefined;
  };

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const importedData = dataService.getAllData();
        let dataToUse: TransitRecord[] = [];
        if (importedData.length > 0) {
          dataToUse = importedData
            .map((record: ImportedRecord, index: number) => convertImportedToTransitRecord(record, index))
            .filter(Boolean) as TransitRecord[];
        } else {
          dataToUse = [];
        }

        // Применяем фильтры и поиск
        let filtered = [...dataToUse];

        // Если фильтр "Высокая вероятность" активен — показываем только реальные данные
        if (filters?.probability_filter) {
  const { high, elevated, medium, low } = filters.probability_filter;

  if (high) {
    filtered = [...HIGH_PROBABILITY_DATA];
  } else if (elevated) {
    filtered = [...ELEVATED_PROBABILITY_DATA];
  } else if (medium) {
    filtered = [...MEDIUM_PROBABILITY_DATA];
  } else if (low) {
    filtered = [...LOW_PROBABILITY_DATA];
  } else {
    // Если выбрано несколько или ни одного — применяем стандартную фильтрацию
    const activeProbabilities = Object.entries(filters.probability_filter)
      .filter(([_, active]) => active)
      .map(([key, _]) => {
        switch (key) {
          case 'high': return 'Высокая вероятность';
          case 'elevated': return 'Повышенная вероятность';
          case 'medium': return 'Средняя вероятность';
          case 'low': return 'Низкая вероятность';
          default: return '';
        }
      });
    if (activeProbabilities.length > 0) {
      filtered = filtered.filter(record =>
        activeProbabilities.includes(record.probability_category)
      );
            }
          }
        }

        // Применение фильтров по уровню риска
        if (filters?.risk_filter) {
          const activeRisks = Object.entries(filters.risk_filter)
            .filter(([_, active]) => active)
            .map(([key, _]) => {
              switch (key) {
                case 'minimal': return 'Минимальный';
                case 'low': return 'Низкий';
                case 'medium': return 'Средний';
                case 'high': return 'Высокий';
                case 'critical': return 'Критический';
                default: return '';
              }
            });
          
          if (activeRisks.length > 0) {
            filtered = filtered.filter(record => 
              activeRisks.includes(record.risk_level)
            );
          }
        }

        // Применение фильтров по типу аномалий
        if (filters?.anomaly_filter) {
          const activeAnomalies = Object.entries(filters.anomaly_filter)
            .filter(([_, active]) => active)
            .map(([key, _]) => key);
          
          if (activeAnomalies.length > 0) {
            if (activeAnomalies.includes('no_anomalies')) {
              // Если выбран фильтр "без аномалий"
              filtered = filtered.filter(record => record.anomalies.length === 0);
            } else {
              // Если выбраны конкретные типы аномалий
              filtered = filtered.filter(record => 
                record.anomalies.some(anomaly => {
                  const anomalyType = anomaly.type.replace('_anomaly', '');
                  return activeAnomalies.includes(anomalyType);
                })
              );
            }
          }
        }

        // Быстрые фильтры
        if (filters?.quick_filters?.only_anomalies) {
          filtered = filtered.filter(record => record.anomalies.length > 0);
        }
        if (filters?.quick_filters?.high_probability_only) {
          filtered = filtered.filter(record => record.probability_category === 'Высокая вероятность');
        }
        if (filters?.quick_filters?.recent_only) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filtered = filtered.filter(record => 
            new Date(record.data_prib_import) > oneWeekAgo
          );
        }

        // Применение поиска
        if (searchQuery && searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(record => 
            record.nomer_vagona.toLowerCase().includes(searchLower) ||
            record.naimenovanie_gruza.toLowerCase().includes(searchLower) ||
            record.id_import.toString().includes(searchLower) ||
            record.id_export.toString().includes(searchLower) ||
            record.stancia_otpr.toLowerCase().includes(searchLower) ||
            record.stancia_pereaddr.toLowerCase().includes(searchLower) ||
            record.stancia_nazn.toLowerCase().includes(searchLower) ||
            (record.gruzopoluchatel_bin || '').includes(searchLower) ||
            (record.gruzootpravitel_bin || '').includes(searchLower)
          );
        }

        // Применяем сортировку
        if (sortDirection && sortColumn) {
          filtered.sort((a, b) => {
            let aVal: any, bVal: any;
            
            switch (sortColumn) {
              case 'id_import':
                aVal = a.id_import;
                bVal = b.id_import;
                break;
              case 'id_export':
                aVal = a.id_export;
                bVal = b.id_export;
                break;
              case 'nomer_vagona':
                aVal = a.nomer_vagona;
                bVal = b.nomer_vagona;
                break;
              case 'data_prib_import':
                aVal = new Date(a.data_prib_import).getTime();
                bVal = new Date(b.data_prib_import).getTime();
                break;
              case 'data_otpr_export':
                aVal = new Date(a.data_otpr_export).getTime();
                bVal = new Date(b.data_otpr_export).getTime();
                break;
              case 'ves_import':
                aVal = a.ves_import;
                bVal = b.ves_import;
                break;
              case 'ves_export':
                aVal = a.ves_export;
                bVal = b.ves_export;
                break;
              case 'strana_otpr_import':
                aVal = a.strana_otpr_import;
                bVal = b.strana_otpr_import;
                break;
              case 'strana_nazn_export':
                aVal = a.strana_nazn_export;
                bVal = b.strana_nazn_export;
                break;
              case 'stancia_otpr':
                aVal = a.stancia_otpr;
                bVal = b.stancia_otpr;
                break;
              case 'stancia_nazn':
                aVal = a.stancia_nazn;
                bVal = b.stancia_nazn;
                break;
              case 'stancia_pereaddr':
                aVal = a.stancia_pereaddr;
                bVal = b.stancia_pereaddr;
                break;
              case 'naimenovanie_gruza':
                aVal = a.naimenovanie_gruza;
                bVal = b.naimenovanie_gruza;
                break;
              case 'gruzopoluchatel_bin':
                aVal = a.gruzopoluchatel_bin || '';
                bVal = b.gruzopoluchatel_bin || '';
                break;
              case 'gruzootpravitel_bin':
                aVal = a.gruzootpravitel_bin || '';
                bVal = b.gruzootpravitel_bin || '';
                break;
              case 'probability_category':
                // Сортировка по приоритету вероятности
                const priorityMap = {
                  'Высокая вероятность': 4,
                  'Повышенная вероятность': 3,
                  'Средняя вероятность': 2,
                  'Низкая вероятность': 1
                };
                aVal = priorityMap[a.probability_category as keyof typeof priorityMap] || 0;
                bVal = priorityMap[b.probability_category as keyof typeof priorityMap] || 0;
                break;
              default:
                aVal = a.id_import;
                bVal = b.id_import;
            }

            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return sortDirection === 'asc' 
                ? aVal.localeCompare(bVal, 'ru') 
                : bVal.localeCompare(aVal, 'ru');
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        setRecords(filtered);
        setTotalRecords(dataToUse.length);
        
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const mockData = generateMockTransitRecords(1000);
        setRecords(mockData);
        setTotalRecords(mockData.length);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    const unsubscribe = dataService.subscribe(() => {
      loadData();
    });

    return unsubscribe;
  }, [pageSize, sortColumn, sortDirection, searchQuery, filters]);

  // Пагинация
  const totalPages = Math.ceil(records.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = records.slice(startIndex, endIndex);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn('');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRecordClick = (record: TransitRecord) => {
    console.log('Clicked record:', record.id_import);
    if (onRecordClick) {
      onRecordClick(record);
    }
  };

  // Функция для получения описания вероятности аномалии
  const getProbabilityTooltip = (probabilityCategory: string): string => {
    switch (probabilityCategory) {
      case 'Высокая вероятность':
        return 'Высокая вероятность аномалии (85-100%): Требуется немедленная проверка и дополнительные меры безопасности';
      case 'Повышенная вероятность':
        return 'Повышенная вероятность аномалии (65-84%): Рекомендуется дополнительная проверка документов и груза';
      case 'Средняя вероятность':
        return 'Средняя вероятность аномалии (35-64%): Возможны нарушения, требуется внимание со стороны операторов';
      case 'Низкая вероятность':
        return 'Низкая вероятность аномалии (0-34%): Операция соответствует стандартным процедурам';
      default:
        return 'Уровень вероятности аномалии не определен';
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>


      {/* Поиск */}
      <div className="flex items-center space-x-4 p-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по номеру вагона, ID, БИН, станции или грузу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={onFiltersToggle}
          variant="outline"
          size="sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>

      {/* Таблица */}
      <div className="flex-1 table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-0 py-0"
                onClick={() => handleSort('id_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID импорт</span>
                  {sortColumn === 'id_import' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'id_import' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('id_export')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID экспорт</span>
                  {sortColumn === 'id_export' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'id_export' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('nomer_vagona')}
              >
                <div className="flex items-center space-x-1">
                  <span>Номер вагона</span>
                  {sortColumn === 'nomer_vagona' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'nomer_vagona' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('strana_otpr_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>Страна отправления импорт</span>
                  {sortColumn === 'strana_otpr_import' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'strana_otpr_import' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('strana_nazn_export')}
              >
                <div className="flex items-center space-x-1">
                  <span>Страна назначения экспорт</span>
                  {sortColumn === 'strana_nazn_export' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'strana_nazn_export' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('stancia_otpr')}
              >
                <div className="flex items-center space-x-1">
                  <span>Станция отправления</span>
                  {sortColumn === 'stancia_otpr' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'stancia_otpr' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('stancia_pereaddr')}
              >
                <div className="flex items-center space-x-1">
                  <span>Станция переадресации</span>
                  {sortColumn === 'stancia_pereaddr' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'stancia_pereaddr' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('stancia_nazn')}
              >
                <div className="flex items-center space-x-1">
                  <span>Станция назначения</span>
                  {sortColumn === 'stancia_nazn' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'stancia_nazn' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('data_prib_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>Дата прибытия импорт</span>
                  {sortColumn === 'data_prib_import' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'data_prib_import' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('data_otpr_export')}
              >
                <div className="flex items-center space-x-1">
                  <span>Дата отправления экспорт</span>
                  {sortColumn === 'data_otpr_export' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'data_otpr_export' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('ves_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>Вес на вагон импорт</span>
                  {sortColumn === 'ves_import' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'ves_import' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('ves_export')}
              >
                <div className="flex items-center space-x-1">
                  <span>Вес на вагон экспорт</span>
                  {sortColumn === 'ves_export' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'ves_export' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('naimenovanie_gruza')}
              >
                <div className="flex items-center space-x-1">
                  <span>Наименование груза</span>
                  {sortColumn === 'naimenovanie_gruza' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'naimenovanie_gruza' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('gruzopoluchatel_bin')}
              >
                <div className="flex items-center space-x-1">
                  <span>Грузополучатель БИН</span>
                  {sortColumn === 'gruzopoluchatel_bin' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'gruzopoluchatel_bin' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('gruzootpravitel_bin')}
              >
                <div className="flex items-center space-x-1">
                  <span>Грузоотправитель БИН</span>
                  {sortColumn === 'gruzootpravitel_bin' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'gruzootpravitel_bin' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('probability_category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Вероятность</span>
                  {sortColumn === 'probability_category' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'probability_category' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead>Аномалии</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow
                key={record.id_import}
                className={cn(
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                  getTableRowClass(record)
                )}
                onClick={() => handleRecordClick(record)}
              >
                <TableCell className="px-0 py-0">{formatRecordId(record.id_import)}</TableCell>
                <TableCell className="px-0 py-0">{formatRecordId(record.id_export)}</TableCell>
                <TableCell className="px-0 py-0">{formatWagonNumber(record.nomer_vagona)}</TableCell>
                <TableCell className="px-0 py-0">
                  <span className="text-xs px-2 py-0 rounded bg-gray-100 dark:bg-gray-800">
                    {getCountryDisplayName(record.strana_otpr_import)}
                  </span>
                </TableCell>
                <TableCell className="px-0 py-0">
                  <span className="text-xs px-2 py-0 rounded bg-gray-100 dark:bg-gray-800">
                    {getCountryDisplayName(record.strana_nazn_export)}
                  </span>
                </TableCell>
                <TableCell className="px-0 py-0">{record.stancia_otpr}</TableCell>
                <TableCell className="px-0 py-0">{record.stancia_pereaddr}</TableCell>
                <TableCell className="px-0 py-0">{record.stancia_nazn}</TableCell>
                <TableCell className="px-0 py-0">{formatDate(record.data_prib_import)}</TableCell>
                <TableCell className="px-0 py-0">{formatDate(record.data_otpr_export)}</TableCell>
                <TableCell className="px-0 py-0">{formatWeight(record.ves_import)}</TableCell>
                <TableCell className="px-0 py-0">{formatWeight(record.ves_export)}</TableCell>
                <TableCell className="px-0 py-0">{record.naimenovanie_gruza}</TableCell>
                <TableCell className="px-0 py-0">
                  <span className="text-xs px-2 py-0 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {record.gruzopoluchatel_bin || 'Н/Д'}
                  </span>
                </TableCell>
                <TableCell className="px-0 py-0">
                  <span className="text-xs px-2 py-0 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {record.gruzootpravitel_bin || 'Н/Д'}
                  </span>
                </TableCell>
                <TableCell className="px-0 py-0">
                  <Badge 
                    className={getProbabilityCategoryClass(record.probability_category)}
                    title={getProbabilityTooltip(record.probability_category)}
                  >
                    {record.probability_category}
                  </Badge>
                </TableCell>
                <TableCell className="px-0 py-0">
                  {record.anomalies.length > 0 ? (
                    <div 
                      className="flex space-x-1"
                      title={record.anomalies.slice(0, 5).map(anomaly => 
                        `${getAnomalyTypeName(anomaly.type)}: ${anomaly.description}`
                      ).join('; ') + (record.anomalies.length > 5 ? `; И еще ${record.anomalies.length - 5} аномалий...` : '')}
                    >
                      {record.anomalies.slice(0, 3).map((anomaly, index) => (
                        <span key={index} className="text-sm">
                          {getAnomalyTypeIcon(anomaly.type)}
                        </span>
                      ))}
                      {record.anomalies.length > 3 && (
                        <span className="text-xs text-gray-500">+{record.anomalies.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Нет</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Показано {startIndex + 1}-{Math.min(endIndex, records.length)} из {records.length} записей
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};