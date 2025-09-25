// Файл больше не нужен - функциональность перенесена в основной TransitDataTable.tsx
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
  AlertTriangle, 
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
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Конвертация ImportedRecord в TransitRecord
  const convertImportedToTransitRecord = (record: ImportedRecord, index: number): TransitRecord => {
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

    const anomalies = (record.anomaly_types || []).map(type => ({
      type: type.includes('_') ? type : `${type}_anomaly`,
      severity: 'medium' as const,
      description: `Обнаружена аномалия типа ${type}`,
      explanation: `Подробное объяснение аномалии ${type}`,
      confidence: Math.random() * 0.4 + 0.6
    }));

    let risk_level = 'Минимальный';
    if (anomalies.length > 3) risk_level = 'Критический';
    else if (anomalies.length > 2) risk_level = 'Высокий';
    else if (anomalies.length > 1) risk_level = 'Средний';
    else if (anomalies.length > 0) risk_level = 'Низкий';

    return {
      id_import: Number(record.id?.replace(/[^0-9]/g, '')) || (1000000 + index),
      id_export: Number(record.id?.replace(/[^0-9]/g, '')) + 1000000 || (2000000 + index),
      nomer_vagona: record.wagon_container_number || `${Math.floor(Math.random() * 9000) + 1000}${Math.floor(Math.random() * 9000) + 1000}`,
      strana_otpr_import: record.departure_country_code || 'RU',
      strana_nazn_export: record.destination_country_code || 'KZ',
      stancia_otpr: record.departure_station_name || 'Москва-Сорт',
      stancia_pereaddr: record.departure_station_name || 'Промежуточная',
      stancia_nazn: record.destination_station_name || 'Алматы-I',
      data_prib_import: record.arrival_date || new Date().toISOString().split('T')[0],
      data_otpr_export: record.departure_date || new Date().toISOString().split('T')[0],
      ves_import: record.total_weight || Math.floor(Math.random() * 50000) + 1000,
      ves_export: record.wagon_weight || record.total_weight || Math.floor(Math.random() * 50000) + 1000,
      naimenovanie_gruza: record.cargo_name || 'Груз',
      probability_category,
      anomalies,
      risk_level,
      recommendations: anomalies.length > 0 ? [
        'Требуется дополнительная проверка документов',
        'Рекомендуется физический осмотр груза',
        'Уведомить службу безопасности'
      ] : []
    } as TransitRecord;
  };

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const importedData = dataService.getAllData();
        
        let dataToUse: TransitRecord[] = [];
        
        if (importedData.length > 0) {
          dataToUse = importedData.map((record: ImportedRecord, index: number) => 
            convertImportedToTransitRecord(record, index)
          );
        } else {
          dataToUse = generateMockTransitRecords(1000);
        }
        
        // Применяем фильтры и поиск
        let filtered = [...dataToUse];
        
        if (searchQuery && searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(record => 
            record.nomer_vagona.toLowerCase().includes(searchLower) ||
            record.naimenovanie_gruza.toLowerCase().includes(searchLower) ||
            record.id_import.toString().includes(searchLower) ||
            record.id_export.toString().includes(searchLower)
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
      {/* Подсказка о горизонтальном скролле */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 mx-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>
                Используйте горизонтальный скролл для просмотра всех столбцов таблицы.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScrollHint(false)}
                className="ml-auto text-blue-600 hover:text-blue-800 p-1 h-auto"
              >
                ×
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Поиск */}
      <div className="flex items-center space-x-4 p-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по номеру вагона, ID или грузу..."
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
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('id_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID Импорт</span>
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
                  <span>ID Экспорт</span>
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
              <TableHead>Страна отпр.</TableHead>
              <TableHead>Страна назн.</TableHead>
              <TableHead>Станция отпр.</TableHead>
              <TableHead>Станция назн.</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleSort('data_prib_import')}
              >
                <div className="flex items-center space-x-1">
                  <span>Дата приб.</span>
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
                  <span>Дата отпр.</span>
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
                  <span>Вес импорт</span>
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
                  <span>Вес экспорт</span>
                  {sortColumn === 'ves_export' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> :
                    sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : null
                  )}
                  {sortColumn !== 'ves_export' && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                </div>
              </TableHead>
              <TableHead>Наименование груза</TableHead>
              <TableHead>Вероятность</TableHead>
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
                <TableCell>{formatRecordId(record.id_import)}</TableCell>
                <TableCell>{formatRecordId(record.id_export)}</TableCell>
                <TableCell>{formatWagonNumber(record.nomer_vagona)}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {getCountryDisplayName(record.strana_otpr_import)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {getCountryDisplayName(record.strana_nazn_export)}
                  </span>
                </TableCell>
                <TableCell>{record.stancia_otpr}</TableCell>
                <TableCell>{record.stancia_nazn}</TableCell>
                <TableCell>{formatDate(record.data_prib_import)}</TableCell>
                <TableCell>{formatDate(record.data_otpr_export)}</TableCell>
                <TableCell>{formatWeight(record.ves_import)}</TableCell>
                <TableCell>{formatWeight(record.ves_export)}</TableCell>
                <TableCell>{record.naimenovanie_gruza}</TableCell>
                <TableCell>
                  <Badge className={getProbabilityCategoryClass(record.probability_category)}>
                    {record.probability_category}
                  </Badge>
                </TableCell>
                <TableCell>
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