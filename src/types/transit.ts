// Типы данных для системы анализа транзитных операций

export interface Anomaly {
  type: 'weight_anomaly' | 'time_anomaly' | 'route_anomaly' | 'duplicate_anomaly';
  severity: 'low' | 'medium' | 'high';
  description: string;
  explanation: string;
  confidence: number;
}

export interface TransitRecord {
  // Основные идентификаторы
  id_import: number;
  id_export: number;
  nomer_vagona: string;
  
  // Дополнительные поля для полной таблицы
  kod_soob?: string;
  kpp?: string;
  data_peredachi?: string;
  nomer_naryada?: string;
  stan_nazn_kzh: string;
  naimen_st_naz_kzh?: string;
  obsh_ves?: number;
  mes?: number;
  dokument?: string;
  kod_plat?: string;
  naimenovanie_plat?: string;
  plat_otpr?: string;
  naimenovanie_plat_otp?: string;
  go?: string;
  stan_otpr_kzh: string;
  naimen_st_otp_kzh?: string;
  gp?: string;
  
  // Географические данные
  strana_otpr_import: string;
  strana_nazn_export: string;
  stancia_otpr: string;
  stancia_pereaddr: string;
  stancia_nazn: string;
  
  // Временные данные
  data_prib_import: string;
  data_otpr_export: string;
  data_otpr?: string;
  data_prib?: string;
  data_vydachi?: string;
  
  // Грузовые данные
  ves_import: number;
  ves_export: number;
  naimenovanie_gruza: string;
  gp_1: string;
  go_1: string;
  gruZ?: string;
  
  // Вычисляемые поля
  raznost_vesa?: number;
  
  // Финансовые данные
  vzyskano_pri_otpravlenii?: number[];
  vzyskano_po_pribytiyu?: number[];
  
  // Дополнительные поля
  strana_nazn?: string;
  naimen_str_naz?: string;
  strana_otpr?: string;
  naimen_str_otp?: string;
  vid_soobsheniya?: number;
  priznak_1_ch_smesh_per?: number;
  summa_sost_na_vagon?: number;
  ves_na_vagon?: number;
  priznak_pereadr?: number;
  osobaya_otmetka?: string;
  mesto_rascheta?: number;
  forma_rascheta?: number;
  rasstoyanie?: number;
  
  // Тарифные данные
  sostav_tarifa_otpr?: number[];
  sostav_tarifa_prib?: number[];
  
  // Участники перевозки
  gruzootpravitel?: string;
  naimenovanie_go?: string;
  gruzopoluchatel?: string;
  naimenovanie_gp?: string;
  gruzootpravitel_bin?: string;
  gruzopoluchatel_bin?: string;
  
  // Категория вероятности
  probability_category: 'Высокая вероятность' | 'Повышенная вероятность' | 'Средняя вероятность' | 'Низкая вероятность';
  
  // Уровень риска
  risk_level: 'Минимальный' | 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  
  // Аномалии
  anomalies: Anomaly[];
  recommendations: string[];
}

export interface FilterState {
  // Основные фильтры
  probability_filter: {
    high: boolean;
    elevated: boolean;
    medium: boolean;
    low: boolean;
  };
  
  risk_filter: {
    minimal: boolean;
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
  
  anomaly_filter: {
    weight: boolean;
    time: boolean;
    route: boolean;
    duplicate: boolean;
    no_anomalies: boolean;
  };
  
  // Дополнительные фильтры
  date_filter: {
    preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    custom_start?: string;
    custom_end?: string;
  };
  
  geography_filter: {
    departure_countries: string[];
    destination_countries: string[];
    stations: string[];
  };
  
  cargo_filter: {
    weight_min?: number;
    weight_max?: number;
    cargo_types: string[];
    weight_difference_threshold?: number;
  };
  
  // Быстрые фильтры
  quick_filters: {
    only_anomalies: boolean;
    high_probability_only: boolean;
    recent_only: boolean;
  };
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_records: number;
  page_size: number;
}

export interface APIResponse<T> {
  data: T;
  pagination?: PaginationData;
  filters_applied?: Record<string, any>;
  execution_time?: number;
  cache_hit?: boolean;
}

export interface DashboardStats {
  total_records: number;
  probability_distribution: {
    high: number;
    elevated: number; 
    medium: number;
    low: number;
  };
  anomaly_stats: {
    total_anomalies: number;
    by_type: Record<string, number>;
    by_risk: Record<string, number>;
  };
  recent_critical: TransitRecord[];
  timeline_data: {
    date: string;
    total_operations: number;
    anomalies_count: number;
    high_probability: number;
  }[];
}

export interface RecordDetails {
  // Основная информация
  basic_info: TransitRecord;
  
  // Детали вероятности
  probability_details: {
    category: string;
    explanation: string;
    criteria_met: {
      station_match: boolean;
      weight_match: boolean;
      cargo_code_match: boolean;
    };
    confidence_score: number;
  };
  
  // Детали аномалий
  anomaly_details: {
    total_anomalies: number;
    anomalies: Anomaly[];
    ai_analysis: string;
    recommendations: string[];
  };
  
  // История изменений
  audit_trail: {
    created_at: string;
    updated_at: string;
    changes: AuditChange[];
  };
}

export interface AuditChange {
  field: string;
  old_value: any;
  new_value: any;
  changed_at: string;
  changed_by: string;
  reason?: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  include_columns: string[];
  apply_current_filters: boolean;
  include_anomaly_details: boolean;
  include_recommendations: boolean;
  date_format: 'iso' | 'local' | 'custom';
  file_name?: string;
}

export interface TableParams {
  page: number;
  size: number;
  sort: string;
  direction: 'asc' | 'desc';
  search: string;
  filters: FilterState;
}

export interface CountryStation {
  country: string;
  stations: string[];
}