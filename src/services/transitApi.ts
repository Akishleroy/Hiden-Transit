// API сервисы для системы анализа транзитных операций

import { 
  TransitRecord, 
  FilterState, 
  APIResponse, 
  DashboardStats, 
  RecordDetails,
  ExportOptions,
  TableParams,
  CountryStation
} from '../types/transit';

// Базовый URL API
const API_BASE_URL = '/api';

// Функция для создания query параметров
const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

// Основные API функции для транзитных записей
export const fetchTransitRecords = async (params: TableParams): Promise<APIResponse<TransitRecord[]>> => {
  const queryString = createQueryString({
    page: params.page,
    size: params.size,
    sort: `${params.sort}:${params.direction}`,
    search: params.search,
    filters: params.filters
  });

  const response = await fetch(`${API_BASE_URL}/transit/records?${queryString}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch records: ${response.statusText}`);
  }
  return response.json();
};

export const fetchTransitRecord = async (id: string): Promise<RecordDetails> => {
  const response = await fetch(`${API_BASE_URL}/transit/record/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch record: ${response.statusText}`);
  }
  return response.json();
};

// Dashboard статистика
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
  }
  return response.json();
};

// Фильтры и справочники
export const fetchCountries = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/filters/countries`);
  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.statusText}`);
  }
  return response.json();
};

export const fetchStations = async (): Promise<CountryStation[]> => {
  const response = await fetch(`${API_BASE_URL}/filters/stations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCargoTypes = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/filters/cargo-types`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cargo types: ${response.statusText}`);
  }
  return response.json();
};

// Поиск
export const searchRecords = async (query: string, fields: string[] = []): Promise<TransitRecord[]> => {
  const queryString = createQueryString({
    q: query,
    fields: fields.join(',')
  });

  const response = await fetch(`${API_BASE_URL}/search?${queryString}`);
  if (!response.ok) {
    throw new Error(`Failed to search records: ${response.statusText}`);
  }
  return response.json();
};

// Экспорт данных
export const exportData = async (
  format: 'csv' | 'excel',
  filters?: FilterState,
  searchQuery?: string
): Promise<Blob> => {
  // Генерируем mock данные для экспорта
  const mockData = generateMockTransitRecords(1000);
  
  // Применяем фильтры (можно переиспользовать логику из TransitDataTable)
  let filteredData = mockData;
  
  if (searchQuery) {
    const search = searchQuery.toLowerCase();
    filteredData = filteredData.filter(record => 
      record.nomer_vagona.toLowerCase().includes(search) ||
      record.strana_otpr_import.toLowerCase().includes(search) ||
      record.strana_nazn_export.toLowerCase().includes(search) ||
      record.naimenovanie_gruza.toLowerCase().includes(search)
    );
  }

  // Применение основных фильтров из FilterState
  if (filters) {
    // Фильтр по вероятности
    if (filters.probability_filter) {
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
        filteredData = filteredData.filter(record => 
          activeProbabilities.includes(record.probability_category)
        );
      }
    }

    // Фильтр по уровню риска
    if (filters.risk_filter) {
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
        filteredData = filteredData.filter(record => 
          activeRisks.includes(record.risk_level)
        );
      }
    }

    // Фильтр по типу аномалий
    if (filters.anomaly_filter) {
      const activeAnomalies = Object.entries(filters.anomaly_filter)
        .filter(([_, active]) => active)
        .map(([key, _]) => key);
      
      if (activeAnomalies.length > 0) {
        if (activeAnomalies.includes('no_anomalies')) {
          // Если выбран фильтр "без аномалий"
          filteredData = filteredData.filter(record => record.anomalies.length === 0);
        } else {
          // Если выбраны конкретные типы аномалий
          filteredData = filteredData.filter(record => 
            record.anomalies.some(anomaly => {
              const anomalyType = anomaly.type.replace('_anomaly', '');
              return activeAnomalies.includes(anomalyType);
            })
          );
        }
      }
    }

    // Быстрые фильтры
    if (filters.quick_filters?.only_anomalies) {
      filteredData = filteredData.filter(record => record.anomalies.length > 0);
    }
    if (filters.quick_filters?.critical_only) {
      filteredData = filteredData.filter(record => record.risk_level === 'Критический');
    }
    if (filters.quick_filters?.high_probability_only) {
      filteredData = filteredData.filter(record => record.probability_category === 'Высокая вероятность');
    }
    if (filters.quick_filters?.recent_only) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filteredData = filteredData.filter(record => 
        new Date(record.data_prib_import) > oneWeekAgo
      );
    }
  }
  
  if (format === 'csv') {
    // Создаем CSV
    const headers = [
      'ID Import',
      'ID Export', 
      'Номер вагона',
      'Страна отправления',
      'Страна назначения',
      'Станция отправления',
      'Станция назначения',
      'Дата прибытия импорт',
      'Дата отправления эк��порт',
      'Вес импорт',
      'Вес экспорт',
      'Наименование груза',
      'Категория вероятности',
      'Уровень риска',
      'Количество аномалий'
    ];
    
    const rows = filteredData.map(record => [
      record.id_import,
      record.id_export,
      record.nomer_vagona,
      record.strana_otpr_import,
      record.strana_nazn_export,
      record.stancia_otpr,
      record.stancia_nazn,
      record.data_prib_import,
      record.data_otpr_export,
      record.ves_import,
      record.ves_export,
      record.naimenovanie_gruza,
      record.probability_category,
      record.risk_level,
      record.anomalies.length
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  } else {
    // Для Excel создаем простой формат TSV
    const headers = [
      'ID Import',
      'ID Export', 
      'Номер вагона',
      'Страна отправления',
      'Страна назначения',
      'Станция отправления',
      'Станция назначения',
      'Дата прибытия импорт',
      'Дата отправления экспорт',
      'Вес импорт',
      'Вес экспорт',
      'Наименование груза',
      'Категория вероятности',
      'Уровень риска',
      'Количество аномалий'
    ];
    
    const rows = filteredData.map(record => [
      record.id_import,
      record.id_export,
      record.nomer_vagona,
      record.strana_otpr_import,
      record.strana_nazn_export,
      record.stancia_otpr,
      record.stancia_nazn,
      record.data_prib_import,
      record.data_otpr_export,
      record.ves_import,
      record.ves_export,
      record.naimenovanie_gruza,
      record.probability_category,
      record.risk_level,
      record.anomalies.length
    ]);
    
    const tsvContent = [headers, ...rows]
      .map(row => row.join('\t'))
      .join('\n');
    
    return new Blob(['\uFEFF' + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  }
};

export const generateReport = async (
  filters?: FilterState,
  options?: Partial<ExportOptions>
): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/export/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error(`Report generation failed: ${response.statusText}`);
  }

  return response.blob();
};

// Аномалии
export const detectAnomalies = async (recordId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/anomalies/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ record_id: recordId })
  });

  if (!response.ok) {
    throw new Error(`Anomaly detection failed: ${response.statusText}`);
  }

  return response.json();
};

export const explainAnomalies = async (recordId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/anomalies/explain/${recordId}`);
  if (!response.ok) {
    throw new Error(`Failed to explain anomalies: ${response.statusText}`);
  }
  return response.json();
};

export const markAsReviewed = async (recordId: string, notes?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/anomalies/mark-reviewed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      record_id: recordId,
      notes 
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to mark as reviewed: ${response.statusText}`);
  }
};

// Утилиты для файлов - УЛУЧШЕННАЯ ВЕРСИЯ
export const downloadFile = (blob: Blob, filename: string) => {
  try {
    // Проверяем что blob существует и имеет размер
    if (!blob || blob.size === 0) {
      throw new Error('Файл пуст или не создан');
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Устанавливаем атрибуты ссылки
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Добавляем в DOM и кликаем
    document.body.appendChild(link);
    link.click();
    
    // Убираем из DOM и освобождаем URL
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`Файл ${filename} успешно скачан, размер: ${blob.size} байт`);
  } catch (error) {
    console.error('Ошибка скачивания файла:', error);
    throw new Error(`Не удалось скачать файл: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  }
};

// Mock данные для разработки
export const generateMockTransitRecords = (count: number = 50): TransitRecord[] => {
  const countries = ['RU', 'KZ', 'CN', 'MN', 'UZ', 'KG', 'TJ', 'AM', 'GE', 'AZ'];
  const stations = ['Москва-Сорт', 'Алматы-I', 'Урумчи', 'Улан-Батор', 'Ташкент', 'Бишкек'];
  const cargoTypes = ['Контейнеры', 'Уголь', 'Руда железная', 'Нефтепродукты', 'Зерно', 'Металлоизделия'];
  const probabilities = ['Высокая вероятность', 'Повышенная вероятность', 'Средняя вероятность', 'Низкая вероятность'] as const;
  const riskLevels = ['Минимальный', 'Низкий', 'Средний', 'Высокий', 'Критический'] as const;
  const anomalyTypes = ['weight_anomaly', 'time_anomaly', 'route_anomaly', 'duplicate_anomaly'] as const;

  return Array.from({ length: count }, (_, index) => {
    const hasAnomalies = Math.random() > 0.7;
    const numAnomalies = hasAnomalies ? Math.floor(Math.random() * 3) + 1 : 0;
    
    const anomalies = Array.from({ length: numAnomalies }, () => ({
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      description: 'Обнаружено отклонение от нормального диапазона',
      explanation: 'Подробное объяснение аномалии',
      confidence: Math.random() * 0.4 + 0.6 // 0.6-1.0
    }));

    const importWeight = Math.floor(Math.random() * 50000) + 1000;
    const exportWeight = hasAnomalies && Math.random() > 0.5 
      ? importWeight + (Math.random() * 1000 - 500) // добавляем аномалию веса
      : importWeight;

    return {
      id_import: 1000000 + index,
      id_export: 2000000 + index,
      nomer_vagona: `${Math.floor(Math.random() * 9000) + 1000}${Math.floor(Math.random() * 9000) + 1000}`,
      
      // Дополнительные поля для полной таблицы - БЕЗ NULL значений
      kod_soob: Math.floor(Math.random() * 10).toString(),
      kpp: `${Math.floor(Math.random() * 90000000) + 10000000}`,
      data_peredachi: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      nomer_naryada: (Math.floor(Math.random() * 99999) + 1000).toString(),
      stan_nazn_kzh: `KZH${Math.floor(Math.random() * 1000) + 100}`,
      naimen_st_naz_kzh: stations[Math.floor(Math.random() * stations.length)],
      stan_otpr_kzh: `KZH${Math.floor(Math.random() * 1000) + 200}`, 
      naimen_st_otp_kzh: stations[Math.floor(Math.random() * stations.length)],
      obsh_ves: importWeight,
      mes: Math.floor(Math.random() * 12) + 1,
      dokument: `ЭЛ${Math.floor(Math.random() * 999999) + 100000}`,
      kod_plat: Math.floor(Math.random() * 9999999) + 1000000,
      naimenovanie_plat: `ТОО "КТЖ ГРУЗОВЫЕ ПЕРЕВОЗКИ ${Math.floor(Math.random() * 100) + 1}"`,
      plat_otpr: Math.floor(Math.random() * 9999999) + 1000000,
      naimenovanie_plat_otp: `АО "ТРАНСТЕЛЕКОМ ${Math.floor(Math.random() * 50) + 1}"`,
      go: Math.floor(Math.random() * 99999999) + 10000000,
      gp: Math.floor(Math.random() * 99999999) + 10000000,
      gruZ: `${Math.floor(Math.random() * 10000) + 1000}`,
      
      strana_otpr_import: countries[Math.floor(Math.random() * countries.length)],
      strana_nazn_export: countries[Math.floor(Math.random() * countries.length)],
      stancia_otpr: stations[Math.floor(Math.random() * stations.length)],
      stancia_pereaddr: stations[Math.floor(Math.random() * stations.length)],
      stancia_nazn: stations[Math.floor(Math.random() * stations.length)],
      data_prib_import: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_otpr_export: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_otpr: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_prib: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_vydachi: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      ves_import: importWeight,
      ves_export: exportWeight,
      naimenovanie_gruza: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      gp_1: `GP${Math.floor(Math.random() * 1000)}`,
      go_1: `GO${Math.floor(Math.random() * 1000)}`,
      
      // Добавляем поле для разности веса
      raznost_vesa: Math.abs(exportWeight - importWeight),
      
      // Финансовые данные
      vzyskano_pri_otpravlenii: [Math.floor(Math.random() * 10000000) + 100000],
      vzyskano_po_pribytiyu: [Math.floor(Math.random() * 5000000) + 50000],
      
      // Дополнительные поля
      strana_nazn: countries[Math.floor(Math.random() * countries.length)],
      naimen_str_naz: 'КАЗАХСТАН',
      strana_otpr: countries[Math.floor(Math.random() * countries.length)],
      naimen_str_otp: 'РОССИЯ',
      vid_soobsheniya: Math.floor(Math.random() * 6),
      priznak_1_ch_smesh_per: Math.floor(Math.random() * 100),
      summa_sost_na_vagon: Math.floor(Math.random() * 50000000) + 1000000,
      ves_na_vagon: importWeight,
      priznak_pereadr: Math.floor(Math.random() * 2),
      osobaya_otmetka: Math.random() > 0.8 ? 'Особая отметка' : undefined,
      mesto_rascheta: Math.floor(Math.random() * 10),
      forma_rascheta: Math.floor(Math.random() * 10),
      rasstoyanie: Math.floor(Math.random() * 5000) + 100,
      
      // Тарифные данные
      sostav_tarifa_otpr: Array.from({length: 8}, () => Math.floor(Math.random() * 1000000)),
      sostav_tarifa_prib: Array.from({length: 8}, () => Math.floor(Math.random() * 1000000)),
      
      // Участники перевозки
      gruzootpravitel: `ТОО "ТРАНСКОМ-${Math.floor(Math.random() * 100)}"`,
      naimenovanie_go: `ТОО "ГРУЗОВЫЕ ПЕРЕВОЗКИ-${Math.floor(Math.random() * 100)}"`,
      gruzopoluchatel: `АО "КАЗТЕМИРТРАНС-${Math.floor(Math.random() * 100)}"`,
      naimenovanie_gp: `АО "ЛОГИСТИКА-${Math.floor(Math.random() * 100)}"`,
      
      stan_nazn_kzh: `KZH${Math.floor(Math.random() * 100)}`,
      stan_otpr_kzh: `KZH${Math.floor(Math.random() * 100)}`,
      gruzootpravitel_bin: Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join(''),
      gruzopoluchatel_bin: Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join(''),
      probability_category: probabilities[Math.floor(Math.random() * probabilities.length)],
      anomalies,
      risk_level: hasAnomalies ? riskLevels[Math.floor(Math.random() * 3) + 2] : riskLevels[Math.floor(Math.random() * 2)], // выше риск при аномалиях
      recommendations: hasAnomalies ? [
        'Требуется дополнительная проверка документов',
        'Рекомендуется физический осмотр груза',
        'Уведомить службу безопасности'
      ] : []
    };
  });
};

// Mock функция для статистики
export const generateMockDashboardStats = (): DashboardStats => {
  const totalRecords = 728904;
  
  return {
    total_records: totalRecords,
    probability_distribution: {
      high: Math.floor(totalRecords * 0.15),
      elevated: Math.floor(totalRecords * 0.25),
      medium: Math.floor(totalRecords * 0.35),
      low: Math.floor(totalRecords * 0.25)
    },
    anomaly_stats: {
      total_anomalies: 32694,
      by_type: {
        weight_anomaly: 12456,
        time_anomaly: 8934,
        route_anomaly: 7234,
        duplicate_anomaly: 4070
      },
      by_risk: {
        minimal: 15234,
        low: 189456,
        medium: 456789,
        high: 54321,
        critical: 13104
      }
    },
    recent_critical: generateMockTransitRecords(20).filter(r => r.risk_level === 'Критический'),
    timeline_data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_operations: Math.floor(Math.random() * 1000) + 500,
      anomalies_count: Math.floor(Math.random() * 100) + 20,
      high_probability: Math.floor(Math.random() * 200) + 100
    })).reverse()
  };
};