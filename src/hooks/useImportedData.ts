// Хук для работы с импортированными данными

import { useState, useEffect } from 'react';
import { dataService, ImportedRecord } from '../services/dataService';

export interface ImportedDataStats {
  total: number;
  high: number;
  elevated: number;
  medium: number;
  low: number;
}

export function useImportedData() {
  const [data, setData] = useState<ImportedRecord[]>([]);
  const [stats, setStats] = useState<ImportedDataStats>({
    total: 0,
    high: 0,
    elevated: 0,
    medium: 0,
    low: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Инициализация данных
    const initialData = dataService.getAllData();
    const initialStats = dataService.getAnomalyStats();
    
    setData(initialData);
    setStats({
      total: initialStats.total,
      high: initialStats.high,
      elevated: initialStats.elevated,
      medium: initialStats.medium,
      low: initialStats.low
    });
    setIsLoading(false);

    // Подписка на изменения
    const unsubscribe = dataService.subscribe((newData) => {
      const newStats = dataService.getAnomalyStats();
      setData(newData);
      setStats({
        total: newStats.total,
        high: newStats.high,
        elevated: newStats.elevated,
        medium: newStats.medium,
        low: newStats.low
      });
    });

    return unsubscribe;
  }, []);

  // Функции для работы с данными
  const importData = (newData: ImportedRecord[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      dataService.replaceData(newData);
    } else {
      dataService.appendData(newData);
    }
  };

  const clearData = () => {
    dataService.clearData();
  };

  const exportData = () => {
    return dataService.exportToCSV();
  };

  const findRecords = (criteria: Partial<ImportedRecord>) => {
    return dataService.findRecords(criteria);
  };

  const getRecordsByAnomalyType = (type: string) => {
    return dataService.getRecordsByAnomalyType(type);
  };

  const getRecordsByDateRange = (startDate: Date, endDate: Date) => {
    return dataService.getRecordsByDateRange(startDate, endDate);
  };

  const getLastImportInfo = () => {
    return dataService.getLastImportInfo();
  };

  return {
    data,
    stats,
    isLoading,
    importData,
    clearData,
    exportData,
    findRecords,
    getRecordsByAnomalyType,
    getRecordsByDateRange,
    getLastImportInfo
  };
}