// Сервис для работы с бэкенд API
// Замените статические данные на эти функции для интеграции с бэкендом

import { 
  PROBABILITY_DATA, 
  ANOMALY_DATA, 
  SYSTEM_STATS, 
  CRITICAL_ANOMALIES,
  TIMELINE_DATA,
  COUNTRIES_DATA,
  CARGO_TYPES,
  RAILWAY_STATIONS,
  ANALYTICS_DATA,
  CHAT_SESSIONS,
  PRESET_QUESTIONS,
  NAVIGATION_ITEMS,
  QUICK_ACCESS_ITEMS,
  APP_CONSTANTS
} from '../../data/staticData';

// Базовый URL API (настройте под ваш бэкенд)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Утилита для HTTP запросов
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    // В случае ошибки возвращаем статические данные как fallback
    throw error;
  }
};

// ===== DASHBOARD API =====

export const dashboardApi = {
  // Данные вероятностей
  async getProbabilityData() {
    try {
      return await apiRequest('/dashboard/probability-data');
    } catch (error) {
      console.warn('Используются статические данные для вероятностей');
      return PROBABILITY_DATA;
    }
  },

  // Данные аномалий
  async getAnomalyData() {
    try {
      return await apiRequest('/dashboard/anomaly-data');
    } catch (error) {
      console.warn('Используются статические данные для аномалий');
      return ANOMALY_DATA;
    }
  },

  // Критические аномалии
  async getCriticalAnomalies(limit: number = 10) {
    try {
      return await apiRequest(`/dashboard/critical-anomalies?limit=${limit}`);
    } catch (error) {
      console.warn('Используются статические данные для критических аномалий');
      return CRITICAL_ANOMALIES.slice(0, limit);
    }
  },

  // Данные временной шкалы
  async getTimelineData(period: string = '7d') {
    try {
      return await apiRequest(`/dashboard/timeline?period=${period}`);
    } catch (error) {
      console.warn('Используются статические данные для временной шкалы');
      return TIMELINE_DATA;
    }
  },

  // Быстрый доступ
  async getQuickAccessItems() {
    try {
      return await apiRequest('/dashboard/quick-access');
    } catch (error) {
      console.warn('Используются статические данные для быстрого доступа');
      return QUICK_ACCESS_ITEMS;
    }
  }
};

// ===== СИСТЕМА API =====

export const systemApi = {
  // Системная статистика
  async getSystemStats() {
    try {
      return await apiRequest('/system/stats');
    } catch (error) {
      console.warn('Используются статические данные для системной статистики');
      return SYSTEM_STATS;
    }
  },

  // Константы приложения
  async getAppConstants() {
    try {
      return await apiRequest('/system/constants');
    } catch (error) {
      console.warn('Используются статические константы приложения');
      return APP_CONSTANTS;
    }
  },

  // Проверка здоровья системы
  async getHealthCheck() {
    try {
      return await apiRequest('/system/health');
    } catch (error) {
      return { status: 'error', message: 'API недоступен' };
    }
  }
};

// ===== СПРАВОЧНИКИ API =====

export const referenceApi = {
  // Страны
  async getCountries() {
    try {
      return await apiRequest('/reference/countries');
    } catch (error) {
      console.warn('Используются статические данные стран');
      return COUNTRIES_DATA;
    }
  },

  // Типы грузов
  async getCargoTypes() {
    try {
      return await apiRequest('/reference/cargo-types');
    } catch (error) {
      console.warn('Используются статические типы грузов');
      return CARGO_TYPES;
    }
  },

  // Железнодорожные станции
  async getRailwayStations(country?: string) {
    try {
      const url = country ? `/reference/stations?country=${country}` : '/reference/stations';
      return await apiRequest(url);
    } catch (error) {
      console.warn('Используются статические данные станций');
      return country 
        ? RAILWAY_STATIONS.filter(station => station.country === country)
        : RAILWAY_STATIONS;
    }
  }
};

// ===== АНАЛИТИКА API =====

export const analyticsApi = {
  // Данные аналитики
  async getAnalyticsData(tab: string = 'performance') {
    try {
      return await apiRequest(`/analytics/data?tab=${tab}`);
    } catch (error) {
      console.warn('Используются статические данные аналитики');
      return ANALYTICS_DATA;
    }
  },

  // Производительность
  async getPerformanceMetrics() {
    try {
      return await apiRequest('/analytics/performance');
    } catch (error) {
      console.warn('Используются статические метрики производительности');
      return ANALYTICS_DATA.performance;
    }
  },

  // Географические данные
  async getGeographicData() {
    try {
      return await apiRequest('/analytics/geographic');
    } catch (error) {
      console.warn('Используются статические географические данные');
      return ANALYTICS_DATA.geographic;
    }
  },

  // Финансовые показатели
  async getFinancialData() {
    try {
      return await apiRequest('/analytics/financial');
    } catch (error) {
      console.warn('Используются статические финансовые данные');
      return ANALYTICS_DATA.financial;
    }
  }
};

// ===== ЧАТ API =====

export const chatApi = {
  // Сессии чата
  async getChatSessions(userId?: string) {
    try {
      const url = userId ? `/chat/sessions?userId=${userId}` : '/chat/sessions';
      return await apiRequest(url);
    } catch (error) {
      console.warn('Используются статические данные чат-сессий');
      return CHAT_SESSIONS;
    }
  },

  // Предустановленные вопросы
  async getPresetQuestions(category?: string) {
    try {
      const url = category ? `/chat/preset-questions?category=${category}` : '/chat/preset-questions';
      return await apiRequest(url);
    } catch (error) {
      console.warn('Используются статические предустановленные вопросы');
      return category 
        ? PRESET_QUESTIONS.filter(q => q.category === category)
        : PRESET_QUESTIONS;
    }
  },

  // Отправка сообщения
  async sendMessage(sessionId: string, message: string) {
    try {
      return await apiRequest('/chat/message', {
        method: 'POST',
        body: JSON.stringify({ sessionId, message })
      });
    } catch (error) {
      // Возвращаем мок-ответ
      return {
        id: `msg_${Date.now()}`,
        sessionId,
        message: `Это тестовый ответ на сообщение: "${message}"`,
        timestamp: new Date().toISOString(),
        type: 'ai'
      };
    }
  }
};

// ===== НАВИГАЦИЯ API =====

export const navigationApi = {
  // Элементы навигации
  async getNavigationItems(userRole?: string) {
    try {
      const url = userRole ? `/navigation/items?role=${userRole}` : '/navigation/items';
      return await apiRequest(url);
    } catch (error) {
      console.warn('Используются статические элементы навигации');
      return NAVIGATION_ITEMS;
    }
  }
};

// ===== ПОЛЬЗОВАТЕЛИ API =====

export const usersApi = {
  // Текущий пользователь
  async getCurrentUser() {
    try {
      return await apiRequest('/users/me');
    } catch (error) {
      return {
        id: 'user_001',
        username: 'beka',
        name: 'Бекзат Алимов',
        role: 'admin',
        avatar: null,
        lastLogin: new Date().toISOString(),
        isActive: true
      };
    }
  },

  // Список пользователей
  async getUsers() {
    try {
      return await apiRequest('/users/list');
    } catch (error) {
      console.warn('Используются статические данные пользователей');
      return [];
    }
  }
};

// ===== ЭКСПОРТ ВСЕХ API =====

export const backendApi = {
  dashboard: dashboardApi,
  system: systemApi,
  reference: referenceApi,
  analytics: analyticsApi,
  chat: chatApi,
  navigation: navigationApi,
  users: usersApi
};

// Утилиты для проверки доступности API
export const apiUtils = {
  async checkApiAvailability() {
    try {
      await systemApi.getHealthCheck();
      return true;
    } catch (error) {
      return false;
    }
  },

  async getApiStatus() {
    const isAvailable = await this.checkApiAvailability();
    return {
      isAvailable,
      baseUrl: API_BASE_URL,
      timestamp: new Date().toISOString()
    };
  }
};

export default backendApi;