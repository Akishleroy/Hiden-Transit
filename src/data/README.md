# Централизованные статические данные Gray Tranzit

Этот файл содержит инструкции по работе с централизованными данными для упрощения интеграции с бэкендом.

## 📁 Структура данных

### `/data/staticData.ts`
Основной файл со всеми статическими данными приложения, разделенными по категориям:

#### 🏠 Dashboard данные
- `PROBABILITY_DATA` - данные для карточек вероятностей
- `ANOMALY_DATA` - данные для карточек аномалий  
- `CRITICAL_ANOMALIES` - критические аномалии
- `TIMELINE_DATA` - данные для временной шкалы
- `QUICK_ACCESS_ITEMS` - элементы быстрого доступа

#### 📊 Системная статистика
- `SYSTEM_STATS` - основные метрики системы
- `ANALYTICS_DATA` - данные для аналитики

#### 🧭 Навигация и интерфейс
- `NAVIGATION_ITEMS` - элементы навигационного меню
- `QUICK_ACCESS_ITEMS` - быстрый доступ

#### 🌍 Справочные данные
- `COUNTRIES_DATA` - страны и их данные
- `CARGO_TYPES` - типы грузов
- `RAILWAY_STATIONS` - железнодорожные станции

#### 🤖 AI и чат
- `CHAT_SESSIONS` - сессии чата
- `PRESET_QUESTIONS` - предустановленные вопросы

#### 👤 Пользователи и права
- `USER_ROLES` - роли пользователей
- `SAMPLE_USERS` - примеры пользователей

#### ⚙️ Конфигурация
- `FILTER_CONFIGS` - настройки фильтров
- `APP_CONSTANTS` - константы приложения

## 🔄 Как подключить бэкенд

### 1. Создайте API сервисы

```typescript
// services/api/dashboardApi.ts
export const fetchProbabilityData = async () => {
  const response = await fetch('/api/dashboard/probability-data');
  return response.json();
};

export const fetchAnomalyData = async () => {
  const response = await fetch('/api/dashboard/anomaly-data');
  return response.json();
};

export const fetchSystemStats = async () => {
  const response = await fetch('/api/system/stats');
  return response.json();
};
```

### 2. Обновите компоненты

В компонентах замените импорты статических данных на API вызовы:

```typescript
// Было:
import { PROBABILITY_DATA } from '../data/staticData';

// Стало:
import { fetchProbabilityData } from '../services/api/dashboardApi';

// В компоненте:
const [probabilityData, setProbabilityData] = useState([]);

useEffect(() => {
  fetchProbabilityData().then(setProbabilityData);
}, []);
```

### 3. Используйте React Query для кеширования

```typescript
import { useQuery } from '@tanstack/react-query';

const useProbabilityData = () => {
  return useQuery({
    queryKey: ['probability-data'],
    queryFn: fetchProbabilityData,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
```

## 📝 Обновленные компоненты

### ✅ Dashboard (`/pages/Dashboard.tsx`)
- ✅ Использует `PROBABILITY_DATA` 
- ✅ Использует `ANOMALY_DATA`
- ✅ Использует `QUICK_ACCESS_ITEMS`
- ✅ Использует `SYSTEM_STATS`

### ✅ Sidebar (`/components/layout/Sidebar.tsx`)
- ✅ Использует `NAVIGATION_ITEMS`
- ✅ Использует `PROBABILITY_DATA` для статистики
- ✅ Использует `APP_CONSTANTS` для версии
- ✅ Использует `SYSTEM_STATS` для счетчика записей

### 🔄 Требуют обновления:
- `ChatPage.tsx` → использовать `CHAT_SESSIONS`, `PRESET_QUESTIONS`
- `AnalyticsPage.tsx` → использовать `ANALYTICS_DATA`
- `TransitTablePage.tsx` → использовать `COUNTRIES_DATA`, `CARGO_TYPES`

## 🛠 API Endpoints для бэкенда

### Dashboard
- `GET /api/dashboard/probability-data` → `PROBABILITY_DATA`
- `GET /api/dashboard/anomaly-data` → `ANOMALY_DATA`
- `GET /api/dashboard/critical-anomalies` → `CRITICAL_ANOMALIES`
- `GET /api/dashboard/timeline` → `TIMELINE_DATA`

### Система
- `GET /api/system/stats` → `SYSTEM_STATS`
- `GET /api/system/constants` → `APP_CONSTANTS`

### Справочники
- `GET /api/reference/countries` → `COUNTRIES_DATA`
- `GET /api/reference/cargo-types` → `CARGO_TYPES`
- `GET /api/reference/stations` → `RAILWAY_STATIONS`

### Пользователи
- `GET /api/users/roles` → `USER_ROLES`
- `GET /api/users/list` → `SAMPLE_USERS`

### AI и чат
- `GET /api/chat/sessions` → `CHAT_SESSIONS`
- `GET /api/chat/preset-questions` → `PRESET_QUESTIONS`

## 📋 Примеры структур данных

### Вероятность аномалии
```typescript
interface ProbabilityData {
  id: string;
  title: string;
  value: number;
  percentage: number;
  colorClass: string;
  textColor: string;
  // ... другие поля
}
```

### Системная статистика
```typescript
interface SystemStats {
  totalRecords: number;
  todayOperations: number;
  weekOperations: number;
  uptime: number;
  responseTime: number;
  // ... другие метрики
}
```

## 🚀 Миграция на бэкенд

1. **Фаза 1**: Замените Dashboard данные
2. **Фаза 2**: Подключите справочники
3. **Фаза 3**: Интегрируйте AI и чат
4. **Фаза 4**: Добавьте пользователей и роли

## 💡 Преимущества централизации

- ✅ Один источник истины для всех данных
- ✅ Легкая замена статических данных на API
- ✅ Консистентность данных во всем приложении  
- ✅ Удобное тестирование с моками
- ✅ Простота поддержки и обновления