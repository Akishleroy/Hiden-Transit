// Утилиты для навигации из аналитики в таблицу операций

import { FilterState } from '../types/transit';

// Типы для различных кликов в аналитике
export type AnalyticsClickType = 
  | 'risk-level'
  | 'probability-category'
  | 'anomaly-type'
  | 'country-route'
  | 'country-filter'
  | 'station-filter'
  | 'cargo-filter'
  | 'weight-range'
  | 'time-period'
  | 'station'
  | 'cargo-type'
  | 'top-operations'
  | 'chart-segment'
  | 'knowledge-base';

export interface AnalyticsClickData {
  type: AnalyticsClickType;
  value: string | number;
  additionalData?: Record<string, any>;
}

// Создает FilterState на основе клика в аналитике
export const createFilterFromAnalyticsClick = (clickData: AnalyticsClickData): FilterState => {
  const baseFilter: FilterState = {
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

  switch (clickData.type) {
    case 'risk-level':
      if (clickData.value === 'critical') {
        baseFilter.risk_filter.critical = true;
        baseFilter.quick_filters.critical_only = true;
      } else if (clickData.value === 'high') {
        baseFilter.risk_filter.high = true;
      } else if (clickData.value === 'medium') {
        baseFilter.risk_filter.medium = true;
      } else if (clickData.value === 'low') {
        baseFilter.risk_filter.low = true;
      } else if (clickData.value === 'minimal') {
        baseFilter.risk_filter.minimal = true;
      }
      break;

    case 'probability-category':
      if (clickData.value === 'high') {
        baseFilter.probability_filter.high = true;
        baseFilter.quick_filters.high_probability_only = true;
      } else if (clickData.value === 'elevated') {
        baseFilter.probability_filter.elevated = true;
      } else if (clickData.value === 'medium') {
        baseFilter.probability_filter.medium = true;
      } else if (clickData.value === 'low') {
        baseFilter.probability_filter.low = true;
      }
      break;

    case 'anomaly-type':
      baseFilter.quick_filters.only_anomalies = true;
      if (clickData.value === 'weight_anomaly') {
        baseFilter.anomaly_filter.weight = true;
      } else if (clickData.value === 'time_anomaly') {
        baseFilter.anomaly_filter.time = true;
      } else if (clickData.value === 'route_anomaly') {
        baseFilter.anomaly_filter.route = true;
      } else if (clickData.value === 'duplicate_anomaly') {
        baseFilter.anomaly_filter.duplicate = true;
      }
      break;

    case 'country-route':
      if (clickData.additionalData?.departure) {
        baseFilter.geography_filter.departure_countries = [clickData.additionalData.departure];
      }
      if (clickData.additionalData?.destination) {
        baseFilter.geography_filter.destination_countries = [clickData.additionalData.destination];
      }
      break;

    case 'country-filter':
      // Для клика по стране в топах - добавляем и как страну отправления, и как назначения
      baseFilter.geography_filter.departure_countries = [clickData.value as string];
      baseFilter.geography_filter.destination_countries = [clickData.value as string];
      break;

    case 'station-filter':
      // Для клика по станции в топах - добавляем в фильтр станций
      baseFilter.geography_filter.stations = [clickData.value as string];
      // Также можем добавить страну если она указана
      if (clickData.additionalData?.country) {
        baseFilter.geography_filter.departure_countries = [clickData.additionalData.country];
        baseFilter.geography_filter.destination_countries = [clickData.additionalData.country];
      }
      break;

    case 'cargo-filter':
      // Для клика по грузу в топах
      baseFilter.cargo_filter.cargo_types = [clickData.value as string];
      break;

    case 'weight-range':
      if (clickData.additionalData?.min !== undefined) {
        baseFilter.cargo_filter.weight_min = clickData.additionalData.min;
      }
      if (clickData.additionalData?.max !== undefined) {
        baseFilter.cargo_filter.weight_max = clickData.additionalData.max;
      }
      break;

    case 'time-period':
      if (clickData.value === 'today') {
        baseFilter.date_filter.preset = 'today';
      } else if (clickData.value === 'week') {
        baseFilter.date_filter.preset = 'week';
      } else if (clickData.value === 'month') {
        baseFilter.date_filter.preset = 'month';
      } else if (clickData.value === 'recent') {
        baseFilter.quick_filters.recent_only = true;
        baseFilter.date_filter.preset = 'week';
      } else if (clickData.value === 'custom' && clickData.additionalData?.date) {
        // Для клика по конкретному дню в графике
        baseFilter.date_filter.preset = 'custom';
        const date = clickData.additionalData.date;
        // Устанавливаем диапазон на один день
        baseFilter.date_filter.custom_start = date;
        baseFilter.date_filter.custom_end = date;
      }
      break;

    case 'station':
      baseFilter.geography_filter.stations = [clickData.value as string];
      break;

    case 'cargo-type':
      baseFilter.cargo_filter.cargo_types = [clickData.value as string];
      break;

    case 'top-operations':
      // Для топ операций показываем только с аномалиями
      baseFilter.quick_filters.only_anomalies = true;
      if (clickData.additionalData?.riskLevel) {
        const risk = clickData.additionalData.riskLevel;
        if (risk === 'critical') baseFilter.risk_filter.critical = true;
        else if (risk === 'high') baseFilter.risk_filter.high = true;
        else if (risk === 'medium') baseFilter.risk_filter.medium = true;
      }
      break;

    case 'chart-segment':
      // Обработка кликов по сегментам диаграмм
      if (clickData.additionalData?.category === 'risk') {
        return createFilterFromAnalyticsClick({
          type: 'risk-level',
          value: clickData.value
        });
      } else if (clickData.additionalData?.category === 'probability') {
        return createFilterFromAnalyticsClick({
          type: 'probability-category',
          value: clickData.value
        });
      } else if (clickData.additionalData?.category === 'anomaly') {
        return createFilterFromAnalyticsClick({
          type: 'anomaly-type',
          value: clickData.value
        });
      }
      break;

    case 'knowledge-base':
      // Обработка переходов в базу знаний
      baseFilter.quick_filters.only_anomalies = true;
      
      if (clickData.value === 'anomalies' && clickData.additionalData?.date) {
        // Фильтр по дню с аномалиями
        baseFilter.date_filter.preset = 'custom';
        baseFilter.date_filter.custom_start = clickData.additionalData.date;
        baseFilter.date_filter.custom_end = clickData.additionalData.date;
      } else if (clickData.value === 'cargo-analysis' && clickData.additionalData?.cargo) {
        // Фильтр по типу груза
        baseFilter.cargo_filter.cargo_types = [clickData.additionalData.cargo];
      } else if (clickData.value === 'country-analysis' && clickData.additionalData?.country) {
        // Фильтр по стране
        baseFilter.geography_filter.departure_countries = [clickData.additionalData.country];
      } else if (clickData.value === 'station-analysis' && clickData.additionalData?.station) {
        // Фильтр по станции
        baseFilter.geography_filter.stations = [clickData.additionalData.station];
      }
      break;
  }

  return baseFilter;
};

// Создает описание фильтра для отображения пользователю
export const getFilterDescription = (clickData: AnalyticsClickData): string => {
  switch (clickData.type) {
    case 'risk-level':
      const riskLabels = {
        critical: 'критический риск',
        high: 'высокий риск',
        medium: 'средний риск',
        low: 'низкий риск',
        minimal: 'минимальный риск'
      };
      return `Операции с ${riskLabels[clickData.value as keyof typeof riskLabels] || clickData.value}`;

    case 'probability-category':
      const probLabels = {
        high: 'высокой вероятностью',
        elevated: 'повышенной вероятностью',
        medium: 'средней вероятностью',
        low: 'низкой вероятностью'
      };
      return `Операции с ${probLabels[clickData.value as keyof typeof probLabels] || clickData.value}`;

    case 'anomaly-type':
      const anomalyLabels = {
        weight_anomaly: 'весовые аномалии',
        time_anomaly: 'временные аномалии',
        route_anomaly: 'маршрутные аномалии',
        duplicate_anomaly: 'дублирование данных'
      };
      return `Операции с ${anomalyLabels[clickData.value as keyof typeof anomalyLabels] || 'аномалиями'}`;

    case 'country-route':
      if (clickData.additionalData?.departure && clickData.additionalData?.destination) {
        return `Маршрут ${clickData.additionalData.departure} → ${clickData.additionalData.destination}`;
      }
      return `Операции по маршруту ${clickData.value}`;

    case 'country-filter':
      return `Операции по стране: ${clickData.value}`;

    case 'station-filter':
      return `Операции через станцию: ${clickData.value}`;

    case 'cargo-filter':
      return `Операции с грузом: ${clickData.value}`;

    case 'weight-range':
      if (clickData.additionalData?.min && clickData.additionalData?.max) {
        return `Операции с весом ${clickData.additionalData.min}-${clickData.additionalData.max} кг`;
      }
      return `Операции с весом ${clickData.value} кг`;

    case 'time-period':
      const timeLabels = {
        today: 'за сегодня',
        week: 'за неделю',
        month: 'за месяц',
        recent: 'за последнее время'
      };
      return `Операции ${timeLabels[clickData.value as keyof typeof timeLabels] || clickData.value}`;

    case 'station':
      return `Операции через станцию ${clickData.value}`;

    case 'cargo-type':
      return `Операции с грузом "${clickData.value}"`;

    case 'top-operations':
      return 'Топ операций по эффективности';

    case 'chart-segment':
      return `Данные из диаграммы: ${clickData.value}`;

    case 'knowledge-base':
      if (clickData.value === 'anomalies' && clickData.additionalData?.date) {
        return `Аномалии за ${clickData.additionalData.date}`;
      } else if (clickData.value === 'cargo-analysis' && clickData.additionalData?.cargo) {
        return `Анализ груза: ${clickData.additionalData.cargo}`;
      } else if (clickData.value === 'country-analysis' && clickData.additionalData?.country) {
        return `Анализ по стране: ${clickData.additionalData.country}`;
      } else if (clickData.value === 'station-analysis' && clickData.additionalData?.station) {
        return `Анализ станции: ${clickData.additionalData.station}`;
      }
      return 'Анализ из базы знаний';

    default:
      return `Фильтрованные операции: ${clickData.value}`;
  }
};

// Создает навигационные параметры для передачи в таблицу
export const createNavigationParams = (clickData: AnalyticsClickData) => {
  return {
    filters: createFilterFromAnalyticsClick(clickData),
    highlight: getFilterDescription(clickData)
  };
};