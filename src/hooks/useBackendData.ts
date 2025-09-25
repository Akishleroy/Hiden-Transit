// Хуки для работы с бэкенд данными
// Используют React Query для кеширования и управления состоянием

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '../services/api/backendApi';

// ===== QUERY KEYS =====
export const QUERY_KEYS = {
  // Dashboard
  PROBABILITY_DATA: ['dashboard', 'probability'],
  ANOMALY_DATA: ['dashboard', 'anomaly'],
  CRITICAL_ANOMALIES: ['dashboard', 'critical-anomalies'],
  TIMELINE_DATA: ['dashboard', 'timeline'],
  QUICK_ACCESS: ['dashboard', 'quick-access'],
  
  // System
  SYSTEM_STATS: ['system', 'stats'],
  APP_CONSTANTS: ['system', 'constants'],
  HEALTH_CHECK: ['system', 'health'],
  
  // Reference
  COUNTRIES: ['reference', 'countries'],
  CARGO_TYPES: ['reference', 'cargo-types'],
  RAILWAY_STATIONS: ['reference', 'stations'],
  
  // Analytics
  ANALYTICS_DATA: ['analytics', 'data'],
  PERFORMANCE_METRICS: ['analytics', 'performance'],
  GEOGRAPHIC_DATA: ['analytics', 'geographic'],
  FINANCIAL_DATA: ['analytics', 'financial'],
  
  // Chat
  CHAT_SESSIONS: ['chat', 'sessions'],
  PRESET_QUESTIONS: ['chat', 'preset-questions'],
  
  // Navigation
  NAVIGATION_ITEMS: ['navigation', 'items'],
  
  // Users
  CURRENT_USER: ['users', 'me'],
  USER_LIST: ['users', 'list']
};

// ===== DASHBOARD HOOKS =====

export const useProbabilityData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROBABILITY_DATA,
    queryFn: backendApi.dashboard.getProbabilityData,
    staleTime: 5 * 60 * 1000, // 5 минут
    cacheTime: 30 * 60 * 1000, // 30 минут
  });
};

export const useAnomalyData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ANOMALY_DATA,
    queryFn: backendApi.dashboard.getAnomalyData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export const useCriticalAnomalies = (limit = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CRITICAL_ANOMALIES, limit],
    queryFn: () => backendApi.dashboard.getCriticalAnomalies(limit),
    staleTime: 2 * 60 * 1000, // 2 минуты (критические данные обновляются чаще)
    cacheTime: 10 * 60 * 1000,
  });
};

export const useTimelineData = (period = '7d') => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TIMELINE_DATA, period],
    queryFn: () => backendApi.dashboard.getTimelineData(period),
    staleTime: 10 * 60 * 1000, // 10 минут
    cacheTime: 60 * 60 * 1000, // 1 час
  });
};

export const useQuickAccessItems = () => {
  return useQuery({
    queryKey: QUERY_KEYS.QUICK_ACCESS,
    queryFn: backendApi.dashboard.getQuickAccessItems,
    staleTime: 60 * 60 * 1000, // 1 час (редко меняется)
    cacheTime: 24 * 60 * 60 * 1000, // 24 часа
  });
};

// ===== SYSTEM HOOKS =====

export const useSystemStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SYSTEM_STATS,
    queryFn: backendApi.system.getSystemStats,
    staleTime: 1 * 60 * 1000, // 1 минута (живые данные)
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Обновляем каждые 30 секунд
  });
};

export const useAppConstants = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APP_CONSTANTS,
    queryFn: backendApi.system.getAppConstants,
    staleTime: 24 * 60 * 60 * 1000, // 24 часа (константы редко меняются)
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH_CHECK,
    queryFn: backendApi.system.getHealthCheck,
    staleTime: 30 * 1000, // 30 секунд
    cacheTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000, // Проверяем каждую минуту
  });
};

// ===== REFERENCE HOOKS =====

export const useCountries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COUNTRIES,
    queryFn: backendApi.reference.getCountries,
    staleTime: 60 * 60 * 1000, // 1 час
    cacheTime: 24 * 60 * 60 * 1000, // 24 часа
  });
};

export const useCargoTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CARGO_TYPES,
    queryFn: backendApi.reference.getCargoTypes,
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

export const useRailwayStations = (country?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RAILWAY_STATIONS, country],
    queryFn: () => backendApi.reference.getRailwayStations(country),
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// ===== ANALYTICS HOOKS =====

export const useAnalyticsData = (tab = 'performance') => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS_DATA, tab],
    queryFn: () => backendApi.analytics.getAnalyticsData(tab),
    staleTime: 10 * 60 * 1000, // 10 минут
    cacheTime: 60 * 60 * 1000,
  });
};

export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PERFORMANCE_METRICS,
    queryFn: backendApi.analytics.getPerformanceMetrics,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Обновляем каждые 2 минуты
  });
};

export const useGeographicData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GEOGRAPHIC_DATA,
    queryFn: backendApi.analytics.getGeographicData,
    staleTime: 30 * 60 * 1000, // 30 минут
    cacheTime: 2 * 60 * 60 * 1000,
  });
};

export const useFinancialData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCIAL_DATA,
    queryFn: backendApi.analytics.getFinancialData,
    staleTime: 60 * 60 * 1000, // 1 час
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// ===== CHAT HOOKS =====

export const useChatSessions = (userId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CHAT_SESSIONS, userId],
    queryFn: () => backendApi.chat.getChatSessions(userId),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export const usePresetQuestions = (category?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRESET_QUESTIONS, category],
    queryFn: () => backendApi.chat.getPresetQuestions(category),
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// Мутация для отправки сообщения
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      backendApi.chat.sendMessage(sessionId, message),
    onSuccess: (data, variables) => {
      // Обновляем кеш чат-сессий после отправки сообщения
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_SESSIONS });
    },
  });
};

// ===== NAVIGATION HOOKS =====

export const useNavigationItems = (userRole?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.NAVIGATION_ITEMS, userRole],
    queryFn: () => backendApi.navigation.getNavigationItems(userRole),
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// ===== USER HOOKS =====

export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: backendApi.users.getCurrentUser,
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_LIST,
    queryFn: backendApi.users.getUsers,
    staleTime: 30 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
  });
};

// ===== COMBINED HOOKS =====

// Хук для получения всех данных Dashboard за раз
export const useDashboardData = () => {
  const probabilityData = useProbabilityData();
  const anomalyData = useAnomalyData();
  const criticalAnomalies = useCriticalAnomalies();
  const systemStats = useSystemStats();
  const quickAccess = useQuickAccessItems();

  return {
    probabilityData,
    anomalyData,
    criticalAnomalies,
    systemStats,
    quickAccess,
    isLoading: [probabilityData, anomalyData, criticalAnomalies, systemStats, quickAccess]
      .some(query => query.isLoading),
    hasError: [probabilityData, anomalyData, criticalAnomalies, systemStats, quickAccess]
      .some(query => query.isError),
  };
};

// Хук для получения всех справочных данных
export const useReferenceData = () => {
  const countries = useCountries();
  const cargoTypes = useCargoTypes();
  const railwayStations = useRailwayStations();

  return {
    countries: countries.data || [],
    cargoTypes: cargoTypes.data || [],
    railwayStations: railwayStations.data || [],
    isLoading: [countries, cargoTypes, railwayStations].some(query => query.isLoading),
    hasError: [countries, cargoTypes, railwayStations].some(query => query.isError),
  };
};

// ===== УТИЛИТЫ =====

// Хук для инвалидации кеша
export const useRefreshData = () => {
  const queryClient = useQueryClient();

  return {
    refreshDashboard: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    refreshSystem: () => {
      queryClient.invalidateQueries({ queryKey: ['system'] });
    },
    refreshAll: () => {
      queryClient.invalidateQueries();
    },
  };
};

export default {
  // Dashboard
  useProbabilityData,
  useAnomalyData,
  useCriticalAnomalies,
  useTimelineData,
  useQuickAccessItems,
  
  // System  
  useSystemStats,
  useAppConstants,
  useHealthCheck,
  
  // Reference
  useCountries,
  useCargoTypes,
  useRailwayStations,
  
  // Analytics
  useAnalyticsData,
  usePerformanceMetrics,
  useGeographicData,
  useFinancialData,
  
  // Chat
  useChatSessions,
  usePresetQuestions,
  useSendMessage,
  
  // Navigation
  useNavigationItems,
  
  // Users
  useCurrentUser,
  useUsers,
  
  // Combined
  useDashboardData,
  useReferenceData,
  
  // Utils
  useRefreshData,
};