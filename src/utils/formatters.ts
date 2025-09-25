// Утилиты для форматирования данных

// Форматирование дат
export const formatDate = (dateString: string): string => {
  if (!dateString) return '—';
  
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '—';
  
  try {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '—';
  
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short'
    });
  } catch {
    return dateString;
  }
};

// Форматирование чисел
export const formatWeight = (weight: number): string => {
  if (weight == null) return '—';
  return weight.toLocaleString('ru-RU');
};

export const formatNumber = (num: number): string => {
  if (num == null) return '—';
  return num.toLocaleString('ru-RU');
};

export const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  if (amount == null) return '—';
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercent = (value: number, total: number): string => {
  if (value == null || total == null || total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

// Форматирование весов с единицами
export const formatWeightWithUnit = (weight: number): string => {
  if (weight == null) return '—';
  
  if (weight >= 1000000) {
    return `${(weight / 1000000).toFixed(1)} т`;
  } else if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)} т`;
  } else {
    return `${weight} кг`;
  }
};

// Форматирование разности весов
export const formatWeightDifference = (importWeight: number, exportWeight: number): string => {
  if (importWeight == null || exportWeight == null) return '—';
  
  const diff = Math.abs(importWeight - exportWeight);
  const percentage = importWeight > 0 ? (diff / importWeight) * 100 : 0;
  
  if (diff === 0) return 'Совпадает';
  
  const sign = exportWeight > importWeight ? '+' : '-';
  return `${sign}${formatWeight(diff)} кг (${percentage.toFixed(1)}%)`;
};

// Форматирование ID записей
export const formatRecordId = (id: number): string => {
  if (id == null) return '—';
  return id.toString().padStart(8, '0');
};

// Форматирование номеров вагонов
export const formatWagonNumber = (number: string): string => {
  if (!number) return '—';
  // Разделяем номер вагона пробелами для лучшей читаемости
  return number.replace(/(\d{4})(\d{4})/, '$1 $2');
};

// Форматирование маршрутов
export const formatRoute = (departure: string, destination: string): string => {
  if (!departure || !destination) return '—';
  return `${departure} → ${destination}`;
};

// Форматирование станций
export const formatStationRoute = (departure: string, transfer: string, destination: string): string => {
  const stations = [departure, transfer, destination].filter(Boolean);
  return stations.join(' → ') || '—';
};

// Цветовые классы для категорий вероятности
export const getProbabilityCategoryClass = (category: string): string => {
  switch (category) {
    case 'Высокая вероятность':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Повышенная вероятность':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Средняя вероятность':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Низкая вероятность':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Цветовые классы для вероятности аномалий
export const getAnomalyProbabilityClass = (probability: string): string => {
  switch (probability) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'elevated':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Цветовые классы для типов аномалий
export const getAnomalyTypeClass = (type: string): string => {
  switch (type) {
    case 'weight_anomaly':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'time_anomaly':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'route_anomaly':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'duplicate_anomaly':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Человекочитаемые названия типов аномалий
export const getAnomalyTypeName = (type: string): string => {
  switch (type) {
    case 'weight_anomaly':
      return 'Аномалия веса';
    case 'time_anomaly':
      return 'Аномалия времени';
    case 'route_anomaly':
      return 'Аномалия маршрута';
    case 'duplicate_anomaly':
      return 'Дубликат';
    default:
      return 'Неизвестная аномалия';
  }
};

// Цветовые классы для строк таблицы по вероятности
export const getTableRowClass = (probabilityCategory: string): string => {
  switch (probabilityCategory) {
    case 'Высокая вероятность':
      return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500';
    case 'Повышенная вероятность':
      return 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500';
    case 'Средняя вероятность':
      return 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500';
    case 'Низкая вероятность':
      return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500';
    default:
      return 'hover:bg-gray-50';
  }
};

// Получение иконки для типа аномалии
export const getAnomalyTypeIcon = (type: string): string => {
  switch (type) {
    case 'weight_anomaly':
      return '⚖️';
    case 'time_anomaly':
      return '⏰';
    case 'route_anomaly':
      return '🛣️';
    case 'duplicate_anomaly':
      return '📋';
    default:
      return '⚠️';
  }
};

// Сокращенные названия стран
export const getCountryName = (code: string): string => {
  const countries: Record<string, string> = {
    'RU': 'Россия',
    'KZ': 'Казахстан',
    'CN': 'Китай',
    'MN': 'Монголия',
    'UZ': 'Узбекистан',
    'KG': 'Киргизия',
    'TJ': 'Таджикистан',
    'AM': 'Армения',
    'GE': 'Грузия',
    'AZ': 'Азербайджан',
    'BY': 'Беларусь',
    'UA': 'Украина'
  };
  
  return countries[code] || code;
};

// Проверка высокой вероятности записи
export const isHighProbabilityRecord = (record: any): boolean => {
  return record.probability_category === 'Высокая вероятность' || 
         record.anomalies?.some((a: any) => a.probability === 'high');
};

// Получение приоритета записи для сортировки по вероятности
export const getRecordPriority = (record: any): number => {
  if (record.probability_category === 'Высокая вероятность') return 4;
  if (record.probability_category === 'Повышенная вероятность') return 3;
  if (record.probability_category === 'Средняя вероятность') return 2;
  if (record.probability_category === 'Низкая вероятность') return 1;
  return 0;
};

// Валидация номера вагона
export const isValidWagonNumber = (number: string): boolean => {
  if (!number) return false;
  // Проверяем, что номер содержит только цифры и имеет правильную длину
  return /^\d{8}$/.test(number.replace(/\s/g, ''));
};

// Форматирование времени выполнения
export const formatExecutionTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}мс`;
  } else {
    return `${(milliseconds / 1000).toFixed(1)}с`;
  }
};

// Форматирование размера файла
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б';
  
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};