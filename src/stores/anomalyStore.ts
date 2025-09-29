// Zustand store для управления состоянием аномалий

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  AnomalyStats, 
  DetailedAnomaly, 
  CriticalAnomaly, 
  TimelineData, 
  AnomalyFilters,
  ChatMessage 
} from '../types/anomalies';
import AnomalyAPI from '../services/api';

interface AnomalyStore {
  // Данные
  stats: AnomalyStats | null;
  anomalies: DetailedAnomaly[];
  criticalAnomalies: CriticalAnomaly[];
  timelineData: TimelineData[];
  chatMessages: ChatMessage[];
  
  // Состояние загрузки
  loading: {
    stats: boolean;
    anomalies: boolean;
    critical: boolean;
    timeline: boolean;
    chat: boolean;
  };
  
  // Ошибки
  error: string | null;
  
  // Фильтры
  filters: AnomalyFilters;
  
  // Пагинация
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  
  // Действия
  fetchStats: () => Promise<void>;
  fetchAnomalies: (page?: number) => Promise<void>;
  fetchCriticalAnomalies: () => Promise<void>;
  fetchTimelineData: (period?: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  setFilters: (filters: Partial<AnomalyFilters>) => void;
  clearError: () => void;
  clearChat: () => void;
}

export const useAnomalyStore = create<AnomalyStore>()(
  devtools(
    (set, get) => ({
      // Начальные данные
      stats: null,
      anomalies: [],
      criticalAnomalies: [],
      timelineData: [],
      chatMessages: [],
      
      // Начальное состояние загрузки
      loading: {
        stats: false,
        anomalies: false,
        critical: false,
        timeline: false,
        chat: false
      },
      
      error: null,
      
      // Фильтры по умолчанию
      filters: {
        type: 'all',
        severity: 'all',
        dateRange: '30days',
        minDeviation: 0,
        search: ''
      },
      
      // Пагинация по умолчанию
      pagination: {
        current: 1,
        total: 0,
        pageSize: 50
      },
      
      // Получение статистики
      fetchStats: async () => {
        set(state => ({ 
          loading: { ...state.loading, stats: true },
          error: null 
        }));
        
        try {
          const stats = await AnomalyAPI.getStats();
          set({ stats });
        } catch (error) {
          set({ error: 'Ошибка загрузки статистики' });
        } finally {
          set(state => ({ 
            loading: { ...state.loading, stats: false }
          }));
        }
      },
      
      // Получение детальных аномалий
      fetchAnomalies: async (page = 1) => {
        set(state => ({ 
          loading: { ...state.loading, anomalies: true },
          error: null 
        }));
        
        try {
          const { filters, pagination } = get();
          const offset = (page - 1) * pagination.pageSize;
          
          const result = await AnomalyAPI.getAnomalies(filters, pagination.pageSize, offset);
          
          set({
            anomalies: result.anomalies,
            pagination: {
              ...pagination,
              current: page,
              total: result.total
            }
          });
        } catch (error) {
          set({ error: 'Ошибка загрузки аномалий' });
        } finally {
          set(state => ({ 
            loading: { ...state.loading, anomalies: false }
          }));
        }
      },
      
      // Получение критических аномалий
      fetchCriticalAnomalies: async () => {
        set(state => ({ 
          loading: { ...state.loading, critical: true },
          error: null 
        }));
        
        try {
          const criticalAnomalies = await AnomalyAPI.getCriticalAnomalies();
          set({ criticalAnomalies });
        } catch (error) {
          set({ error: 'Ошибка загрузки критических аномалий' });
        } finally {
          set(state => ({ 
            loading: { ...state.loading, critical: false }
          }));
        }
      },
      
      // Получение временных данных
      fetchTimelineData: async (period = '30days') => {
        set(state => ({ 
          loading: { ...state.loading, timeline: true },
          error: null 
        }));
        
        try {
          const timelineData = await AnomalyAPI.getTimelineData(period);
          set({ timelineData });
        } catch (error) {
          set({ error: 'Ошибка загрузки временных данных' });
        } finally {
          set(state => ({ 
            loading: { ...state.loading, timeline: false }
          }));
        }
      },
      
      // Отправка сообщения в чат
      sendChatMessage: async (message: string) => {
        if (!message.trim()) return;
        
        // Добавляем пользовательское сообщение
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content: message,
          isUser: true,
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          chatMessages: [...state.chatMessages, userMessage],
          loading: { ...state.loading, chat: true },
          error: null
        }));
        
        try {
          // Моментальный ответ AI без задержки
          const aiResponse = generateAIResponse(message);
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            isUser: false,
            timestamp: new Date().toISOString()
          };
          
          set(state => ({
            chatMessages: [...state.chatMessages, aiMessage]
          }));
        } catch (error) {
          set({ error: 'Ошибка отправки сообщения' });
        } finally {
          set(state => ({ 
            loading: { ...state.loading, chat: false }
          }));
        }
      },
      
      // Установка фильтров
      setFilters: (newFilters: Partial<AnomalyFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, current: 1 }
        }));
        
        // Автоматически перезагружаем данные при изменении фильтров
        get().fetchAnomalies();
      },
      
      // Очистка ошибок
      clearError: () => set({ error: null }),
      
      // Очистка чата
      clearChat: () => set({ chatMessages: [] })
    }),
    {
      name: 'anomaly-store',
      partialize: (state) => ({ 
        filters: state.filters,
        chatMessages: state.chatMessages 
      })
    }
  )
);

// Функция генерации ответов AI
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('статистика') || lowerMessage.includes('сегодня')) {
    return `📊 **Статистика за сегодня:**

• Всего операций: 2,847
• Выявленных аномалий: 127 (4.5%)
• Критические: 23 операции
• Высокий риск: 45 операций
• Средний риск: 59 операций

**Топ аномалий:**
1. Весовые отклонения: 67 случаев
2. Временные задержки: 34 случая  
3. Маршрутные нарушения: 26 случаев

Рекомендую обратить внимание на станцию "Брест-Цен��ральный" - 18 аномалий за день.`;
  }
  
  if (lowerMessage.includes('критические') || lowerMessage.includes('критич')) {
    return `🚨 **Критические аномалии:**

**Обнаружено 23 критические аномалии:**

1. **Вагон №8734291** - Весовое отклонение +127% (Подозрение на перегруз)
2. **Вагон №5629834** - Маршрутное нарушение (Несанкционированная остановка)
3. **Вагон №7423851** - Временная аномалия (Задержка 72 часа)

**Рекомендации:**
• Проверить документы на перегруженные вагоны
• Связаться с диспетчерской службой по маршрутным нарушениям
• Уведомить службу безопасности о подозрительных задержках`;
  }
  
  if (lowerMessage.includes('анализ') && lowerMessage.includes('вес')) {
    return `⚖️ **Анализ весовых отклонений:**

**За последние 7 дней:**
• Среднее отклонение: ±12.3%
• Максимальное отклонение: +184% (вагон №9234567)
• Количество превышений: 156 случаев

**Паттерны:**
• 67% отклонений на маршруте Россия → Беларусь
• Пик аномалий: четверг 14:00-16:00
• Проблемные грузы: металлолом, уголь

**Рекомендации:**
• Усилить контроль взвешивания на станции отправления
• Проверить калибровку весов на станции "Красное"`;
  }
  
  if (lowerMessage.includes('маршрут') || lowerMessage.includes('проблем')) {
    return `🛣️ **Проблемные маршруты:**

**Топ-5 маршрутов с аномалиями:**

1. **Россия → Беларусь** (67 аномалий)
   - Основная проблема: весовые отклонения
   - Станция: Красное-Пасс

2. **Казахстан → Беларусь** (34 аномалии)
   - Основная проблема: временные задержки
   - Станция: Сосновка

3. **Беларусь → Польша** (23 аномалии)
   - Основная проблема: документооборот
   - Станция: Брест-Центральный

**Рекомендации:**
• Оптимизировать процедуры на станции Красное-Пасс
• Улучшить координацию с казахстанской стороной`;
  }
  
  if (lowerMessage.includes('рекомендации') || lowerMessage.includes('рекоменд')) {
    return `💡 **Рекомендации по оптимизации:**

**Краткосрочные (1-2 недели):**
• Увеличить частоту проверок на станции "Красное"
• Внедрить дополнительный контроль для грузов >50 тонн
• Обновить инструкции для операторов

**Среднесрочные (1-3 месяца):**
• Автоматизировать сверку весовых данных
• Интегрировать системы с российскими партнерами
• Обучить персонал новым процедурам

**Долгосрочные (3-12 месяцев):**
• Внедрить предиктивную аналитику
• Создать единую информационную систему
• Оптимизировать логистические цепочки

**Ожидаемый эффект:** снижение аномалий на 35-40%`;
  }
  
  if (lowerMessage.includes('прогноз') || lowerMessage.includes('завтра')) {
    return `🔮 **Прогноз на завтра:**

**Ожидаемые показатели:**
• Количество операций: 2,650-2,800
• Прогнозируемые аномалии: 98-115 (3.7-4.1%)
• Критические риски: 15-20 случаев

**Факторы риска:**
• Неблагоприятные погодные условия (дождь)
• Планируемые работы на станции "Сосновка"
• Повышенный грузопоток из России

**Рекомендации на завтра:**
• Усилить контроль с 10:00 до 14:00
• Подготовить резерв персонала для станции "Сосновка"
• Уведомить службы о возможных задержках

**Вероятность превышения порога аномалий:** 23%`;
  }
  
  // Общий ответ
  return `🤖 **AI Ассистент Gray Tranzit**

Я проанализировал ваш запрос: "${message}"

**Доступные команды:**
• "статистика сегодня" - текущая статистика
• "критические аномалии" - срочные проблемы  
• "анализ веса" - весовые отклонения
• "проблемные маршруты" - маршрутная аналитика
• "рекомендации" - советы по оптимизации
• "прогноз завтра" - предсказания

**Система активна:** 728,904+ операций под контролем
**Точность анализа:** 97.2%
**Время ответа:** <150мс

Чем могу помочь? 🚀`;
}