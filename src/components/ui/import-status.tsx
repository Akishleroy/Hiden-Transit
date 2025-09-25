import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Database, Clock, CheckCircle, X, AlertTriangle, HardDrive } from 'lucide-react';
import { Button } from './button';
import { useImportedData } from '../../hooks/useImportedData';
import { dataService } from '../../services/dataService';

export function ImportStatus() {
  const { stats, getLastImportInfo } = useImportedData();
  const lastImport = getLastImportInfo();
  const [isVisible, setIsVisible] = useState(true);
  const [lastImportTime, setLastImportTime] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [showStorageInfo, setShowStorageInfo] = useState(false);

  // Отслеживаем изменения в импорте для показа/скрытия компонента
  useEffect(() => {
    if (lastImport && lastImport.timestamp !== lastImportTime) {
      setLastImportTime(lastImport.timestamp);
      setIsVisible(true);
      
      // Проверяем информацию о хранилище
      const storageInfo = dataService.getStorageInfo();
      
      // Показываем предупреждения о хранилище
      if (lastImport.type === 'stats-only') {
        setStorageWarning('Данные слишком большие. Сохранена только статистика.');
        setShowStorageInfo(true);
      } else if (lastImport.type === 'compact') {
        setStorageWarning('Данные сжаты. Показаны образцы записей.');
        setShowStorageInfo(true);
      } else if (lastImport.type === 'emergency') {
        setStorageWarning('Аварийное сохранение. Только статистика.');
        setShowStorageInfo(true);
      } else if (storageInfo.usage > 80) {
        setStorageWarning(`Хранилище заполнено на ${storageInfo.usage}%`);
        setShowStorageInfo(true);
      }
      
      // Автоматически скрываем через 10 секунд после нового импорта
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [lastImport, lastImportTime]);

  // Слушаем события сжатия данных
  useEffect(() => {
    const handleCompressed = (event: CustomEvent) => {
      setStorageWarning(`Данные сжаты: ${event.detail.savedSamples} из ${event.detail.totalRecords} записей`);
      setShowStorageInfo(true);
    };

    const handleStatsOnly = (event: CustomEvent) => {
      setStorageWarning(`Сохранена только статистика для ${event.detail.totalRecords} записей`);
      setShowStorageInfo(true);
    };

    window.addEventListener('data-storage-compressed', handleCompressed as EventListener);
    window.addEventListener('data-storage-stats-only', handleStatsOnly as EventListener);

    return () => {
      window.removeEventListener('data-storage-compressed', handleCompressed as EventListener);
      window.removeEventListener('data-storage-stats-only', handleStatsOnly as EventListener);
    };
  }, []);

  // Если нет данных или компонент скрыт, не показываем
  if (stats.total === 0 || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="import-status"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-6 z-40 max-w-sm"
      >
        <Card className={storageWarning 
          ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800" 
          : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${storageWarning 
                  ? 'bg-orange-100 dark:bg-orange-900/40' 
                  : 'bg-green-100 dark:bg-green-900/40'}`}>
                  <Database className={`w-4 h-4 ${storageWarning 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-green-600 dark:text-green-400'}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {storageWarning ? (
                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    <span className={`text-sm font-medium ${storageWarning ? 'text-orange-800 dark:text-orange-200' : 'text-green-800 dark:text-green-200'}`}>
                      {storageWarning || 'Данные загружены'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {showStorageInfo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const info = dataService.getStorageInfo();
                          const message = `Хранилище: ${(info.size / 1024 / 1024).toFixed(1)}MB / ${(info.maxSize / 1024 / 1024).toFixed(1)}MB (${info.usage}%)\nТип данных: ${info.dataType}\nМожет сохранить полные данные: ${info.canStoreFull ? 'Да' : 'Нет'}`;
                          alert(message);
                        }}
                        className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        <HardDrive className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVisible(false)}
                      className="h-6 w-6 p-0 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-xs ${storageWarning ? 'text-orange-700 dark:text-orange-300' : 'text-green-700 dark:text-green-300'}`}>
                    Записей: {stats.total.toLocaleString('ru-RU')}
                    {lastImport?.type && lastImport.type !== 'full' && (
                      <span className="ml-2 text-xs opacity-75">
                        ({lastImport.type === 'compact' ? 'сжато' : 
                          lastImport.type === 'stats-only' ? 'только статистика' : 
                          lastImport.type === 'emergency' ? 'аварийное' : lastImport.type})
                      </span>
                    )}
                  </div>
                  {lastImport && (
                    <div className={`flex items-center gap-1 text-xs ${storageWarning ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                      <Clock className="w-3 h-3" />
                      {new Date(lastImport.timestamp).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {stats.high > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Высокая: {stats.high}
                    </Badge>
                  )}
                  {stats.elevated > 0 && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      Повышенная: {stats.elevated}
                    </Badge>
                  )}
                  {stats.medium > 0 && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Средняя: {stats.medium}
                    </Badge>
                  )}
                  {stats.low > 0 && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Низкая: {stats.low}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}