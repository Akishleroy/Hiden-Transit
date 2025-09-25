// Панель фильтров для таблицы транзитных данных

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { 
  CalendarIcon, 
  X, 
  Save, 
  RotateCcw,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FilterState } from '../../types/transit';
import { formatDate } from '../../utils/formatters';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  onSave?: (name: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onSave,
  isOpen = true,
  onToggle,
  className
}) => {
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const updateFilter = (category: string, key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters[category],
        [key]: value
      }
    });
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    
    // Быстрые фильтры
    if (filters.quick_filters) {
      count += Object.values(filters.quick_filters).filter(Boolean).length;
    }
    
    // Категории вероятности
    if (filters.probability_filter) {
      count += Object.values(filters.probability_filter).filter(Boolean).length;
    }
    
    // Типы аномалий
    if (filters.anomaly_filter) {
      count += Object.values(filters.anomaly_filter).filter(Boolean).length;
    }

    // Фильтры по грузу
    if (filters.cargo_filter?.cargo_types && filters.cargo_filter.cargo_types.length > 0) {
      count += 1;
    }
    
    return count;
  };

  const FilterSection: React.FC<{
    title: string;
    section: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }> = ({ title, section, children, defaultExpanded = true }) => {
    const isCollapsed = collapsedSections[section] ?? !defaultExpanded;
    
    return (
      <div className="space-y-3">
        <Button
          variant="ghost"
          onClick={() => toggleSection(section)}
          className="w-full justify-between p-0 h-auto font-medium text-sm hover:bg-transparent"
        >
          {title}
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
        
        <motion.div
          initial={false}
          animate={{
            height: isCollapsed ? 0 : 'auto',
            opacity: isCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-3">
            {children}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: isOpen ? 320 : 0, 
        opacity: isOpen ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      <Card className={`h-full rounded-none border-0 shadow-none bg-gray-50 dark:bg-gray-900 ${isOpen ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Фильтры</CardTitle>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                title="Сбросить все фильтры"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              {onToggle && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onToggle}
                  title="Скрыть панель фильтров"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Быстрые фильтры */}
          <FilterSection title="Быстрые фильтры" section="quick">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="only-anomalies"
                  checked={filters.quick_filters?.only_anomalies || false}
                  onCheckedChange={(checked) => 
                    updateFilter('quick_filters', 'only_anomalies', checked)
                  }
                />
                <Label htmlFor="only-anomalies" className="text-sm cursor-pointer">
                  Только с аномалиями
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="high-probability"
                  checked={filters.quick_filters?.high_probability_only || false}
                  onCheckedChange={(checked) => 
                    updateFilter('quick_filters', 'high_probability_only', checked)
                  }
                />
                <Label htmlFor="high-probability" className="text-sm cursor-pointer">
                  Только высокая вероятность
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recent-only"
                  checked={filters.quick_filters?.recent_only || false}
                  onCheckedChange={(checked) => 
                    updateFilter('quick_filters', 'recent_only', checked)
                  }
                />
                <Label htmlFor="recent-only" className="text-sm cursor-pointer">
                  Только за последнюю неделю
                </Label>
              </div>
            </div>
          </FilterSection>

          <Separator />

          {/* Категории вероятности */}
          <FilterSection title="Категории вероятности" section="probability">
            <div className="space-y-3">
              {[
                { key: 'high', label: 'Высокая вероятность', color: 'text-red-700' },
                { key: 'elevated', label: 'Повышенная вероятность', color: 'text-orange-700' },
                { key: 'medium', label: 'Средняя вероятность', color: 'text-yellow-700' },
                { key: 'low', label: 'Низкая вероятность', color: 'text-green-700' }
              ].map(({ key, label, color }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`prob-${key}`}
                    checked={filters.probability_filter?.[key as keyof typeof filters.probability_filter] || false}
                    onCheckedChange={(checked) => 
                      updateFilter('probability_filter', key, checked)
                    }
                  />
                  <Label htmlFor={`prob-${key}`} className={`text-sm cursor-pointer ${color}`}>
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Типы аномалий */}
          <FilterSection title="Типы аномалий" section="anomalies">
            <div className="space-y-3">
              {[
                { key: 'weight', label: 'Аномалии веса', icon: '⚖️' },
                { key: 'time', label: 'Аномалии времени', icon: '⏰' },
                { key: 'route', label: 'Аномалии маршрута', icon: '🛣️' },
                { key: 'duplicate', label: 'Дубликаты', icon: '📋' },
                { key: 'no_anomalies', label: 'Без аномалий', icon: '✅' }
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`anomaly-${key}`}
                    checked={filters.anomaly_filter?.[key as keyof typeof filters.anomaly_filter] || false}
                    onCheckedChange={(checked) => 
                      updateFilter('anomaly_filter', key, checked)
                    }
                  />
                  <Label htmlFor={`anomaly-${key}`} className="text-sm cursor-pointer">
                    <span className="mr-2">{icon}</span>
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Фильтры по дате */}
          <FilterSection title="Период" section="date">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'today', label: 'Сегодня' },
                  { key: 'week', label: 'Неделя' },
                  { key: 'month', label: 'Месяц' },
                  { key: 'quarter', label: 'Квартал' },
                  { key: 'year', label: 'Год' },
                  { key: 'custom', label: 'Период' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filters.date_filter?.preset === key ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => updateFilter('date_filter', 'preset', key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              
              {filters.date_filter?.preset === 'custom' && (
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {filters.date_filter?.custom_start ? 
                            formatDate(filters.date_filter.custom_start) : 
                            'Начало'
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.date_filter?.custom_start ? new Date(filters.date_filter.custom_start) : undefined}
                          onSelect={(date) => 
                            updateFilter('date_filter', 'custom_start', date?.toISOString().split('T')[0])
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {filters.date_filter?.custom_end ? 
                            formatDate(filters.date_filter.custom_end) : 
                            'Конец'
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.date_filter?.custom_end ? new Date(filters.date_filter.custom_end) : undefined}
                          onSelect={(date) => 
                            updateFilter('date_filter', 'custom_end', date?.toISOString().split('T')[0])
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </FilterSection>

          <Separator />

          {/* Фильтры по весу и грузу */}
          <FilterSection title="Груз и вес" section="cargo">
            <div className="space-y-3">
              <div>
                <Label htmlFor="cargo-types" className="text-xs">Наименование груза</Label>
                <Input
                  id="cargo-types"
                  placeholder="Поиск по типу груза..."
                  value={filters.cargo_filter?.cargo_types?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFilter('cargo_filter', 'cargo_types', value ? [value] : []);
                  }}
                  className="h-8 text-xs"
                />
                {filters.cargo_filter?.cargo_types && filters.cargo_filter.cargo_types.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.cargo_filter.cargo_types.map((cargoType, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-red-100"
                        onClick={() => {
                          const newCargoTypes = filters.cargo_filter!.cargo_types.filter((_, i) => i !== index);
                          updateFilter('cargo_filter', 'cargo_types', newCargoTypes);
                        }}
                      >
                        {cargoType}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-weight" className="text-xs">Мин. вес (кг)</Label>
                  <Input
                    id="min-weight"
                    type="number"
                    placeholder="0"
                    value={filters.cargo_filter?.weight_min || ''}
                    onChange={(e) => 
                      updateFilter('cargo_filter', 'weight_min', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="max-weight" className="text-xs">Макс. вес (кг)</Label>
                  <Input
                    id="max-weight"
                    type="number"
                    placeholder="∞"
                    value={filters.cargo_filter?.weight_max || ''}
                    onChange={(e) => 
                      updateFilter('cargo_filter', 'weight_max', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="weight-diff" className="text-xs">Разность весов (%)</Label>
                <Input
                  id="weight-diff"
                  type="number"
                  placeholder="Порог различия"
                  value={filters.cargo_filter?.weight_difference_threshold || ''}
                  onChange={(e) => 
                    updateFilter('cargo_filter', 'weight_difference_threshold', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </FilterSection>
        </CardContent>
      </Card>
    </motion.div>
  );
};