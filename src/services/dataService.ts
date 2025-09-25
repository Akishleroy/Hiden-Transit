// Сервис для управления импортированными данными

export interface ImportedRecord {
  id: string;
  
  // ТОЧНЫЕ ПОЛЯ ИЗ CSV СТРУКТУРЫ БЭКЕНДА:
  // Основные поля транзитной записи
  'Код сооб'?: string;                    // message_code
  'КПП'?: string;                         // checkpoint
  'Дата передачи'?: string;               // transmission_date
  'Номер наряда'?: string;                // order_number
  'Стан. назн КЗХ'?: string;             // destination_station_code
  'Наимен.ст.наз КЗХ'?: string;          // destination_station_name
  'Общ.вес'?: number;                     // total_weight
  'Мес'?: string;                         // month
  'Документ'?: string;                    // document
  'Код плат.'?: string;                   // payer_code
  'Наименование плат.'?: string;          // payer_name
  'Плат. отпр.'?: string;                 // sender_code
  'Наименование плат.отп'?: string;       // sender_name
  'ГО'?: string;                          // departure_code
  'Стан.отпр. КЗХ'?: string;             // departure_station_code
  'Наимен.ст.отп КЗХ'?: string;          // departure_station_name
  'ГП'?: string;                          // destination_code
  'Груз'?: string;                        // cargo_code
  'Наименование груза'?: string;          // cargo_name
  'Дата отпр.'?: string;                  // departure_date
  'Дата приб.'?: string;                  // arrival_date
  'Дата выдачи'?: string;                 // issue_date
  'Взыскано при отправлении'?: number;    // collected_at_departure
  'Взыскано по прибытию'?: number;        // collected_at_arrival
  'Страна назн.'?: string;                // destination_country_code
  'Наимен.стр.наз'?: string;             // destination_country_name
  'Страна отпр.'?: string;                // departure_country_code
  'Наимен.стр.отп'?: string;             // departure_country_name
  'Вид сообщения (0-внутр, 1,4-экспорт, 2,5-импорт)'?: string; // communication_type
  'Признак 1 ч смеш.пер.(94 - 1 часть)'?: string;              // mixed_transport_flag
  'Номер вагона\\конт'?: string;         // wagon_container_number
  'Сумма сост.на вагон'?: number;         // wagon_amount
  'Вес на вагон'?: number;                // wagon_weight
  'Признак переадр'?: string;             // readdressing_flag
  'Особая отметка'?: string;              // special_note
  'Место расчета'?: string;               // calculation_place
  'Форма расчета'?: string;               // calculation_form
  'Расстояние'?: number;                  // distance
  'Коорд.96'?: string;                    // coord_96
  'Категория отправки'?: string;          // shipment_category
  'ТехПД'?: string;                       // tech_pd
  'Грузоотправитель'?: string;            // shipper
  'Грузополучатель'?: string;             // consignee
  
  // Совместимость со старым форматом
  message_code?: string;
  checkpoint?: string;
  transmission_date?: string;
  order_number?: string;
  destination_station_code?: string;
  destination_station_name?: string;
  total_weight?: number;
  month?: string;
  document?: string;
  payer_code?: string;
  payer_name?: string;
  sender_code?: string;
  sender_name?: string;
  departure_code?: string;
  departure_station_code?: string;
  departure_station_name?: string;
  destination_code?: string;
  cargo_code?: string;
  cargo_name?: string;
  departure_date?: string;
  arrival_date?: string;
  issue_date?: string;
  collected_at_departure?: number;
  collected_at_arrival?: number;
  destination_country_code?: string;
  destination_country_name?: string;
  departure_country_code?: string;
  departure_country_name?: string;
  communication_type?: string;
  mixed_transport_flag?: string;
  wagon_container_number?: string;
  wagon_amount?: number;
  wagon_weight?: number;
  readdressing_flag?: string;
  special_note?: string;
  calculation_place?: string;
  calculation_form?: string;
  distance?: number;
  coord_96?: string;
  shipment_category?: string;
  tech_pd?: string;
  shipper?: string;
  consignee?: string;
  
  // Метаданные и анализ (последние 2 строки создаются бэкендом)
  import_date?: string;
  source_line?: number;
  anomaly_probability?: 'high' | 'elevated' | 'medium' | 'low';  // Создается бэкендом
  anomaly_types?: string[];                                       // Создается бэкендом
  
  // Дополнительные поля для анализа
  [key: string]: any;
}

class DataService {
  private static instance: DataService;
  private importedData: ImportedRecord[] = [];
  private listeners: Set<(data: ImportedRecord[]) => void> = new Set();

  private constructor() {
    // Загружаем данные из localStorage при инициализации
    this.loadFromStorage();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Подписка на изменения данных
  public subscribe(listener: (data: ImportedRecord[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Уведомление слушателей об изменениях
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.importedData));
  }

  // Получение всех данных
  public getAllData(): ImportedRecord[] {
    return [...this.importedData];
  }

  // Получение количества записей
  public getCount(): number {
    return this.importedData.length;
  }

  // Добавление данных к существующим
  public appendData(newData: ImportedRecord[]): void {
    // Фильтруем дубликаты по ID
    const existingIds = new Set(this.importedData.map(record => record.id));
    const uniqueNewData = newData.filter(record => !existingIds.has(record.id));
    
    const previousCount = this.importedData.length;
    this.importedData.push(...uniqueNewData);
    
    try {
      this.saveToStorage();
      this.notifyListeners();
      console.log(`Добавлено ${uniqueNewData.length} новых записей. Всего: ${this.importedData.length}`);
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
      // Не откатываемся, так как данные уже в памяти
      this.notifyListeners();
    }
  }

  // Замена всех данных
  public replaceData(newData: ImportedRecord[]): void {
    const previousCount = this.importedData.length;
    this.importedData = [...newData];
    
    try {
      this.saveToStorage();
      this.notifyListeners();
      console.log(`База данных заменена. Новое количество записей: ${this.importedData.length}`);
    } catch (error) {
      // В случае ошибки сохранения откатываемся к предыдущему состоянию
      console.error('Ошибка при замене данных, откат к предыдущему состоянию:', error);
      // Не восстанавливаем старые данные, так как новые уже загружены в память
      // Просто уведомляем об ошибке сохранения
      this.notifyListeners();
    }
  }

  // Очистка всех данных
  public clearData(): void {
    this.importedData = [];
    this.saveToStorage();
    this.notifyListeners();
    
    console.log('База данных очищена');
  }

  // Поиск записей по критериям
  public findRecords(criteria: Partial<ImportedRecord>): ImportedRecord[] {
    return this.importedData.filter(record => {
      return Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        return record[key] === value;
      });
    });
  }

  // Получение статистики по вероятностям аномалий
  public getAnomalyStats(): Record<string, number> {
    const stats = {
      high: 0,
      elevated: 0,
      medium: 0,
      low: 0,
      total: this.importedData.length
    };

    this.importedData.forEach(record => {
      if (record.anomaly_probability) {
        stats[record.anomaly_probability]++;
      }
    });

    return stats;
  }

  // Получение записей по типу аномалии
  public getRecordsByAnomalyType(type: string): ImportedRecord[] {
    return this.importedData.filter(record => 
      record.anomaly_types && record.anomaly_types.includes(type)
    );
  }

  // Получение записей за период
  public getRecordsByDateRange(startDate: Date, endDate: Date): ImportedRecord[] {
    return this.importedData.filter(record => {
      if (!record.transmission_date) return false;
      
      const recordDate = new Date(record.transmission_date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  // Экспорт данных в CSV
  public exportToCSV(): string {
    if (this.importedData.length === 0) return '';

    // Получаем все уникальные ключи из записей
    const allKeys = new Set<string>();
    this.importedData.forEach(record => {
      Object.keys(record).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    const csvRows = [headers.join(';')];

    this.importedData.forEach(record => {
      const row = headers.map(header => {
        const value = record[header];
        if (value === undefined || value === null) return '';
        if (typeof value === 'string' && value.includes(';')) {
          return `"${value}"`;
        }
        return String(value);
      });
      csvRows.push(row.join(';'));
    });

    return csvRows.join('\n');
  }

  // Получение размера данных в байтах
  private getDataSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // Примерная оценка
    }
  }

  // Проверка лимита localStorage (обычно 5-10MB)
  private checkStorageLimit(data: any): boolean {
    const size = this.getDataSize(data);
    const maxSize = 5 * 1024 * 1024; // 5MB лимит
    return size <= maxSize;
  }

  // Создание сжатой версии данных для хранения
  private createCompactData(): any {
    // Если данных слишком много, сохраняем только статистику и мета-информацию
    if (this.importedData.length > 10000) {
      const stats = this.getAnomalyStats();
      const sampleData = this.importedData.slice(0, 100); // Сохраняем первые 100 записей как образец
      
      return {
        isCompact: true,
        stats,
        sampleData,
        totalCount: this.importedData.length,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
    }
    
    // Для небольших объемов сохраняем все данные
    return {
      isCompact: false,
      data: this.importedData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Сохранение в localStorage с обработкой больших данных
  private saveToStorage(): void {
    try {
      // Сначала пытаемся сохранить полные данные
      const fullData = {
        data: this.importedData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Проверяем размер
      if (this.checkStorageLimit(fullData)) {
        localStorage.setItem('gray_transit_imported_data', JSON.stringify(fullData));
        console.log(`Сохранено ${this.importedData.length} записей в localStorage (полная версия)`);
        return;
      }

      // Если данные слишком большие, создаем компактную версию
      const compactData = this.createCompactData();
      
      if (this.checkStorageLimit(compactData)) {
        localStorage.setItem('gray_transit_imported_data', JSON.stringify(compactData));
        console.log(`Сохранено в localStorage (компактная версия): ${this.importedData.length} записей, статистика + ${compactData.sampleData?.length || 0} образцов`);
        
        // Уведомляем пользователя о сжатии данных
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('data-storage-compressed', {
            detail: {
              totalRecords: this.importedData.length,
              savedSamples: compactData.sampleData?.length || 0
            }
          }));
        }
        return;
      }

      // Если даже компактная версия не помещается, сохраняем только статистику
      const statsOnly = {
        isStatsOnly: true,
        stats: this.getAnomalyStats(),
        totalCount: this.importedData.length,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      localStorage.setItem('gray_transit_imported_data', JSON.stringify(statsOnly));
      console.warn(`Данные слишком большие для localStorage. Сохранена только статистика для ${this.importedData.length} записей`);
      
      // Уведомляем о том, что сохранена только статистика
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('data-storage-stats-only', {
          detail: {
            totalRecords: this.importedData.length
          }
        }));
      }

    } catch (error) {
      console.error('Критическая ошибка сохранения в localStorage:', error);
      
      // Пытаемся сохранить хотя бы статистику
      try {
        const emergencyData = {
          isEmergency: true,
          stats: this.getAnomalyStats(),
          totalCount: this.importedData.length,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        };
        localStorage.setItem('gray_transit_imported_data', JSON.stringify(emergencyData));
        console.warn('Сохранена аварийная версия данных (только статистика)');
      } catch (emergencyError) {
        console.error('Не удалось сохранить даже аварийную версию:', emergencyError);
        // Очищаем localStorage если возникла критическая ошибка
        try {
          localStorage.removeItem('gray_transit_imported_data');
        } catch {}
      }
    }
  }

  // Загрузка из localStorage с поддержкой разных форматов
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('gray_transit_imported_data');
      if (!stored) {
        this.importedData = [];
        return;
      }

      const parsed = JSON.parse(stored);

      // Обрабатываем разные форматы сохраненных данных
      if (parsed.isEmergency) {
        console.warn('Загружена аварийная версия данных. Только статистика доступна.');
        this.importedData = [];
        return;
      }

      if (parsed.isStatsOnly) {
        console.warn(`Загружена статистика для ${parsed.totalCount} записей. Полные данные недоступны.`);
        this.importedData = [];
        return;
      }

      if (parsed.isCompact) {
        console.warn(`Загружена компактная версия: статистика + ${parsed.sampleData?.length || 0} образцов из ${parsed.totalCount} записей`);
        this.importedData = parsed.sampleData || [];
        
        // Уведомляем о загрузке компактной версии
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('data-loaded-compact', {
            detail: {
              totalRecords: parsed.totalCount,
              loadedSamples: this.importedData.length
            }
          }));
        }
        return;
      }

      // Обычная полная версия данных
      if (parsed.data && Array.isArray(parsed.data)) {
        this.importedData = parsed.data;
        console.log(`Загружено ${this.importedData.length} записей из localStorage (полная версия)`);
        return;
      }

      // Если формат не распознан
      console.warn('Неизвестный формат данных в localStorage. Инициализация пустого массива.');
      this.importedData = [];

    } catch (error) {
      console.error('Ошибка загрузки данных из localStorage:', error);
      this.importedData = [];
      
      // Пытаемся очистить поврежденные данные
      try {
        localStorage.removeItem('gray_transit_imported_data');
        console.warn('Поврежденные данные удалены из localStorage');
      } catch (clearError) {
        console.error('Не удалось очистить поврежденные данные:', clearError);
      }
    }
  }

  // Получение информации о последнем импорте
  public getLastImportInfo(): { count: number; timestamp: string; type?: string } | null {
    try {
      const stored = localStorage.getItem('gray_transit_imported_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Определяем тип сохраненных данных и количество записей
        let count = 0;
        let type = 'full';
        
        if (parsed.isEmergency) {
          count = parsed.totalCount || 0;
          type = 'emergency';
        } else if (parsed.isStatsOnly) {
          count = parsed.totalCount || 0;
          type = 'stats-only';
        } else if (parsed.isCompact) {
          count = parsed.totalCount || 0;
          type = 'compact';
        } else if (parsed.data) {
          count = parsed.data.length || 0;
          type = 'full';
        }
        
        return {
          count,
          timestamp: parsed.timestamp || '',
          type
        };
      }
    } catch (error) {
      console.warn('Не удалось получить информацию о последнем импорте:', error);
    }
    return null;
  }

  // Получение информации о хранилище
  public getStorageInfo(): { 
    size: number; 
    maxSize: number; 
    usage: number; 
    canStoreFull: boolean;
    dataType: string;
  } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    let currentSize = 0;
    let dataType = 'none';
    
    try {
      const stored = localStorage.getItem('gray_transit_imported_data');
      if (stored) {
        currentSize = this.getDataSize(stored);
        const parsed = JSON.parse(stored);
        
        if (parsed.isEmergency) dataType = 'emergency';
        else if (parsed.isStatsOnly) dataType = 'stats-only';
        else if (parsed.isCompact) dataType = 'compact';
        else if (parsed.data) dataType = 'full';
      }
    } catch (error) {
      console.warn('Ошибка получения информации о хранилище:', error);
    }
    
    const usage = (currentSize / maxSize) * 100;
    const canStoreFull = this.checkStorageLimit({
      data: this.importedData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    });
    
    return {
      size: currentSize,
      maxSize,
      usage: Math.round(usage * 100) / 100,
      canStoreFull,
      dataType
    };
  }

  // Валидация данных
  public validateRecord(record: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Проверяем обязательные поля
    if (!record.id) {
      errors.push('Отсутствует ID записи');
    }

    if (!record.order_number && !record.message_code) {
      errors.push('Должен быть указан либо номер наряда, либо код сообщения');
    }

    // Проверяем формат дат
    const dateFields = ['transmission_date', 'departure_date', 'arrival_date', 'issue_date'];
    dateFields.forEach(field => {
      if (record[field] && record[field] !== '') {
        const date = new Date(record[field]);
        if (isNaN(date.getTime())) {
          errors.push(`Неверный формат даты в поле ${field}`);
        }
      }
    });

    // Проверяем числовые поля
    const numberFields = ['total_weight', 'wagon_amount', 'wagon_weight', 'distance'];
    numberFields.forEach(field => {
      if (record[field] !== undefined && record[field] !== '' && record[field] !== null) {
        if (isNaN(Number(record[field]))) {
          errors.push(`Неверный числовой формат в поле ${field}`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Экспортируем синглтон
export const dataService = DataService.getInstance();

// Экспортируем класс для типизации
export default DataService;