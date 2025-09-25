// API сервисы для интеграции с backend

import { 
  AnomalyStats, 
  DetailedAnomaly, 
  CriticalAnomaly, 
  RouteAnomaly, 
  TransitData, 
  TimelineData, 
  RegionStats,
  ChatMessage,
  AnomalyFilters 
} from '../types/anomalies';

const API_BASE = 'http://localhost:8000/api';

// Имитация API вызовов с моковыми данными
class AnomalyAPI {
  // Получение статистики для дашборда
  static async getStats(): Promise<AnomalyStats> {
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      weight_anomalies: 15234,
      time_anomalies: 8942,
      route_anomalies: 5671,
      duplicates: 2847,
      total_records: 728904
    };
  }

  // Получение детальных данных аномалий
  static async getAnomalies(filters: Partial<AnomalyFilters> = {}, limit = 100, offset = 0): Promise<{
    anomalies: DetailedAnomaly[];
    total: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock detailed anomalies
    const mockAnomalies: DetailedAnomaly[] = Array.from({ length: limit }, (_, i) => ({
      id: `anomaly_${offset + i + 1}`,
      type: ['weight', 'time', 'route', 'duplicate'][Math.floor(Math.random() * 4)] as any,
      severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
      wagon_number: `WAG${(offset + i + 1).toString().padStart(6, '0')}`,
      expected_value: Math.floor(Math.random() * 1000) + 500,
      actual_value: Math.floor(Math.random() * 1000) + 300,
      deviation_percent: Math.floor(Math.random() * 50) + 5,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      details: {
        cargo_type: 'Контейнер',
        route: 'Москва → Владивосток',
        station: 'Центральная станция'
      }
    }));

    return {
      anomalies: mockAnomalies,
      total: 32847
    };
  }

  // Получение критических аномалий
  static async getCriticalAnomalies(): Promise<CriticalAnomaly[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `critical_${i + 1}`,
      type: ['weight', 'time', 'route', 'duplicate'][Math.floor(Math.random() * 4)] as any,
      severity: ['critical', 'high'][Math.floor(Math.random() * 2)] as any,
      description: [
        'Критическое превышение веса груза на 47%',
        'Маршрут значительно отклонился от планового',
        'Обнаружена подозрительная задержка в пути',
        'Дублирование операций с одним вагоном',
        'Несоответствие времени прибытия и отправления',
        'Аномальный вес для данного типа груза',
        'Подозрительная активность на маршруте',
        'Критическое отклонение от стандартного времени'
      ][i],
      details: {
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        wagon: `WAG${(i + 1).toString().padStart(6, '0')}`,
        impact: 'Высокий риск'
      }
    }));
  }

  // Получение данных для карты
  static async getRouteAnomalies(): Promise<{
    routes: RouteAnomaly[];
    regions: RegionStats[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const routes: RouteAnomaly[] = [
      {
        id: 'route_1',
        from_station: 'Москва-Пассажирская',
        to_station: 'Владивосток',
        from_country: 'Россия',
        to_country: 'Россия',
        anomaly_count: 234,
        total_operations: 1250,
        anomaly_percentage: 18.7,
        severity: 'high',
        coordinates: {
          from: [55.7558, 37.6173],
          to: [43.1056, 131.8735]
        }
      },
      {
        id: 'route_2',
        from_station: 'Санкт-Петербург',
        to_station: 'Екатеринбург',
        from_country: 'Россия',
        to_country: 'Россия',
        anomaly_count: 89,
        total_operations: 980,
        anomaly_percentage: 9.1,
        severity: 'medium',
        coordinates: {
          from: [59.9311, 30.3609],
          to: [56.8431, 60.6454]
        }
      }
    ];

    const regions: RegionStats[] = [
      {
        region: 'Центральный ФО',
        country: 'Россия',
        anomaly_count: 5234,
        total_operations: 45678,
        anomaly_percentage: 11.5,
        severity: 'medium'
      },
      {
        region: 'Дальневосточный ФО',
        country: 'Россия',
        anomaly_count: 3456,
        total_operations: 28934,
        anomaly_percentage: 11.9,
        severity: 'high'
      }
    ];

    return { routes, regions };
  }

  // Получение временных данных для графиков
  static async getTimelineData(period = '30days'): Promise<TimelineData[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const days = period === '30days' ? 30 : 7;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      return {
        date: date.toISOString().split('T')[0],
        weight_anomalies: Math.floor(Math.random() * 50) + 10,
        time_anomalies: Math.floor(Math.random() * 30) + 5,
        route_anomalies: Math.floor(Math.random() * 20) + 5,
        duplicates: Math.floor(Math.random() * 15) + 2,
        total: 0
      };
    }).map(item => ({
      ...item,
      total: item.weight_anomalies + item.time_anomalies + item.route_anomalies + item.duplicates
    }));
  }

  // Чат с AI ассистентом
  static async sendChatMessage(message: string): Promise<ChatMessage> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      'Анализ показывает повышенную активность аномалий веса в последние 7 дней. Рекомендую проверить калибровку весов на станции Москва-Товарная.',
      'Обнаружено 15 подозрительных маршрутов с отклонением более 25%. Большинство связаны с направлением Москва-Владивосток.',
      'Статистика за месяц: критических аномалий - 234, высоких - 567, средних - 891. Общий тренд показывает снижение на 12%.',
      'Рекомендую обратить внимание на вагоны серии WAG003xxx - у них повышенный процент аномалий веса.',
      'Анализ временных паттернов показывает пик аномалий в период с 14:00 до 18:00. Возможно связано с пересменкой персонала.'
    ];
    
    return {
      id: `msg_${Date.now()}`,
      message,
      response: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      data: message.toLowerCase().includes('статистика') ? {
        critical: 234,
        high: 567,
        medium: 891,
        low: 445
      } : undefined
    };
  }

  // Анализ транзитных данных
  static async getTransitAnalysis(category?: string, limit = 100): Promise<{
    rows: TransitData[];
    total: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const categories = ['Высокая вероятность', 'Повышенная вероятность', 'Средняя вероятность', 'Низкая вероятность'] as const;
    
    const mockData: TransitData[] = Array.from({ length: limit }, (_, i) => ({
      import_id: `IMP${(i + 1).toString().padStart(8, '0')}`,
      export_id: `EXP${(i + 1).toString().padStart(8, '0')}`,
      wagon_number: `WAG${(i + 1).toString().padStart(6, '0')}`,
      departure_country_import: 'Россия',
      destination_country_export: ['Китай', 'Казахстан', 'Белоруссия', 'Монголия'][Math.floor(Math.random() * 4)],
      transfer_station: 'Забайкальск',
      destination_station: ['Маньчжурия', 'Алма-Ата', 'Минск', 'Улан-Батор'][Math.floor(Math.random() * 4)],
      arrival_date_import: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      departure_date_export: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString(),
      weight_import: Math.floor(Math.random() * 1000) + 500,
      weight_export: Math.floor(Math.random() * 1000) + 450,
      cargo_name: ['Уголь', 'Руда железная', 'Нефть', 'Зерно', 'Контейнеры'][Math.floor(Math.random() * 5)],
      category: categories[Math.floor(Math.random() * 4)]
    }));

    return {
      rows: mockData,
      total: 728904
    };
  }
}

export default AnomalyAPI;