# Система Определения Вероятностей Аномалий в Hide Tranzit

## Обзор системы

Система Hide Tranzit анализирует **728,904+ записей** транзитных операций и выявляет **4 типа аномалий** с цветовой схемой по вероятностям.

## Как определяются Вероятности Аномалий

### 1. Входные данные
Система анализирует CSV файлы с полями:
- Код сообщения
- Номер наряда  
- Вес груза
- Даты передачи/прибытия
- Маршрутные данные
- Страны отправления/назначения

### 2. Алгоритм определения вероятностей

**В файле `/utils/csvParser.ts` (строки 173-181):**
```javascript
// Добавляем анализ аномалий (заглушка)
record.anomaly_probability = Math.random() > 0.7 ? 'high' : 
                           Math.random() > 0.5 ? 'elevated' :
                           Math.random() > 0.3 ? 'medium' : 'low';

record.anomaly_types = [];
if (Math.random() > 0.8) record.anomaly_types.push('weight');
if (Math.random() > 0.9) record.anomaly_types.push('time');
if (Math.random() > 0.85) record.anomaly_types.push('route');
```

**В файле `/services/transitApi.ts` (строки 496-505):**
```javascript
probability_category: probabilities[Math.floor(Math.random() * probabilities.length)],
anomalies,
risk_level: hasAnomalies ? riskLevels[Math.floor(Math.random() * 3) + 2] : riskLevels[Math.floor(Math.random() * 2)], // выше риск при аномалиях
```

### 3. Четыре Категории Вероятностей

| Категория | Цветовая Схема | Диапазон Совпадений | CSS Класс |
|-----------|---------------|-------------------|-----------|
| **Высокая вероятность** | 🔴 Красный | 15-20 совпадений | `bg-red-100 text-red-800 border-red-300` |
| **Повышенная вероятность** | 🟠 Оранжевый | 10-14 совпадений | `bg-orange-100 text-orange-800 border-orange-300` |
| **Средняя вероятность** | 🟡 Жёлтый | 5-9 совпадений | `bg-yellow-100 text-yellow-800 border-yellow-300` |
| **Низкая вероятность** | 🟢 Зелёный | 1-4 совпадения | `bg-green-100 text-green-800 border-green-300` |

### 4. Четыре Типа Аномалий

#### 4.1 Весовые аномалии (`weight_anomaly`)
- **Иконка:** ⚖️ (Weight)
- **Описание:** Существенное отклонение веса между импортом и экспортом
- **Алгоритм:** 
  ```javascript
  const exportWeight = hasAnomalies && Math.random() > 0.5 
    ? importWeight + (Math.random() * 1000 - 500) // добавляем аномалию веса
    : importWeight;
  ```

#### 4.2 Временные аномалии (`time_anomaly`)
- **Иконка:** 🕐 (Clock)
- **Описание:** Нарушение временных рамок транзитных операций
- **Критерии:** Слишком большой или малый промежуток между датами

#### 4.3 Маршрутные аномалии (`route_anomaly`)
- **Иконка:** 🛣️ (Route)
- **Описание:** Подозрительные изменения в маршруте следования
- **Критерии:** Несоответствие обычным маршрутам

#### 4.4 Дубликаты (`duplicate_anomaly`)
- **Иконка:** 📋 (Copy)
- **Описание:** Обнаружение дублирующихся записей
- **Алгоритм:** 
  ```javascript
  if (seenIds.has(record.id)) {
    duplicateCount++;
    errorMessages.push(`Дубликат записи: ${record.order_number || record.message_code || 'неизвестно'}`);
  }
  ```

## Статистика Системы

### Общая статистика (из `/services/transitApi.ts`):
```javascript
total_records: 728904,
probability_distribution: {
  high: 109,336 (15%),     // Высокая вероятность
  elevated: 182,226 (25%), // Повышенная вероятность  
  medium: 255,117 (35%),   // Средняя вероятность
  low: 182,225 (25%)       // Низкая вероятность
}
```

### Статистика аномалий:
```javascript
anomaly_stats: {
  total_anomalies: 32,694,
  by_type: {
    weight_anomaly: 12,456,    // Весовые аномалии
    time_anomaly: 8,934,       // Временные аномалии
    route_anomaly: 7,234,      // Маршрутные аномалии
    duplicate_anomaly: 4,070   // Дубликаты
  }
}
```

## Цветовая Схема в UI

### В таблице транзитных операций:
- Каждая запись имеет бейдж с категорией вероятности
- Цвета соответствуют уровню вероятности
- Аномалии показываются иконками в отдельной колонке

### Функции для стилизации (из `/utils/formatters.ts`):
```javascript
export const getProbabilityCategoryClass = (category: string): string => {
  switch (category) {
    case 'Высокая вероятность':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Повышенная вероятность':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Средняя вероятность':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Низкая вероятность':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
```

## Улучшения системы

### Текущее состояние:
- ✅ Mock данные для демонстрации
- ✅ 4 типа аномалий с цветовой схемой
- ✅ Фильтрация по вероятностям и типам
- ✅ Экспорт данных с аномалиями

### Возможные улучшения:
- 🔄 Интеграция с реальным ML алгоритмом
- 🔄 Обучение модели на исторических данных
- 🔄 Настройка пороговых значений
- 🔄 Добавление новых типов аномалий

## Файлы, содержащие логику аномалий:

1. **`/utils/csvParser.ts`** - Базовое определение аномалий при импорте
2. **`/services/transitApi.ts`** - Генерация mock данных с аномалиями
3. **`/utils/formatters.ts`** - Функции для отображения и стилизации
4. **`/components/tables/TransitDataTable.tsx`** - UI таблицы с аномалиями
5. **`/stores/anomalyStore.ts`** - Состояние аномалий
6. **`/types/transit.ts`** - Типы данных для аномалий