// Типы данных для системы мониторинга аномалий

export interface AnomalyStats {
  weight_anomalies: number;
  time_anomalies: number;
  route_anomalies: number;
  duplicates: number;
  total_records: number;
}

export interface DetailedAnomaly {
  id: string;
  type: 'weight' | 'time' | 'route' | 'duplicate';
  severity: 'critical' | 'high' | 'medium' | 'low';
  wagon_number: string;
  expected_value: any;
  actual_value: any;
  deviation_percent: number;
  timestamp: string;
  details: Record<string, any>;
}

export interface CriticalAnomaly {
  id: string;
  type: 'weight' | 'time' | 'route' | 'duplicate';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  details: any;
}

export interface RouteAnomaly {
  id: string;
  from_station: string;
  to_station: string;
  from_country: string;
  to_country: string;
  anomaly_count: number;
  total_operations: number;
  anomaly_percentage: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates?: {
    from: [number, number];
    to: [number, number];
  };
}

export interface TransitData {
  import_id: string;
  export_id: string;
  wagon_number: string;
  departure_country_import: string;
  destination_country_export: string;
  transfer_station: string;
  destination_station: string;
  arrival_date_import: string;
  departure_date_export: string;
  weight_import: number;
  weight_export: number;
  cargo_name: string;
  category: 'Высокая вероятность' | 'Повышенная вероятность' | 'Средняя вероятность' | 'Низкая вероятность';
}

export interface TimelineData {
  date: string;
  weight_anomalies: number;
  time_anomalies: number;
  route_anomalies: number;
  duplicates: number;
  total: number;
}

export interface DistributionData {
  range: string;
  count: number;
  percentage: number;
}

export interface RegionStats {
  region: string;
  country: string;
  anomaly_count: number;
  total_operations: number;
  anomaly_percentage: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  data?: any;
  charts?: any;
}

export interface AnomalyFilters {
  type: 'all' | 'weight' | 'time' | 'route' | 'duplicate';
  severity: 'all' | 'critical' | 'high' | 'medium' | 'low';
  dateRange: string;
  minDeviation: number;
  search: string;
}

export type AnomalyType = 'weight' | 'time' | 'route' | 'duplicate';
export type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low';