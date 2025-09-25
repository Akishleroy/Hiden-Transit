// Hook для работы с аутентификацией

import { useState, useEffect, useCallback } from 'react';
import { 
  AuthState, 
  LoginCredentials, 
  getAuthState, 
  login as authLogin, 
  logout as authLogout,
  canAccessPage,
  hasRole,
  getRoleDisplayName
} from '../utils/authMiddleware';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ 
    isAuthenticated: false, 
    user: null 
  });
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка состояния аутентификации при инициализации
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const state = getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error('Ошибка при загрузке состояния аутентификации:', error);
        setAuthState({ isAuthenticated: false, user: null });
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Функция входа
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const newAuthState = await authLogin(credentials);
      setAuthState(newAuthState);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Функция выхода
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authLogout();
      setAuthState({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Проверка доступа к странице
  const checkPageAccess = useCallback((page: string): boolean => {
    return canAccessPage(authState, page);
  }, [authState]);

  // Проверка роли
  const checkRole = useCallback((role: string): boolean => {
    return hasRole(authState, role);
  }, [authState]);

  // Получение отображаемого имени роли
  const getUserRoleDisplayName = useCallback((): string => {
    if (!authState.user) return '';
    return getRoleDisplayName(authState.user.role);
  }, [authState]);

  // Получение времени последнего входа
  const getLastLoginTime = useCallback((): string => {
    if (!authState.user) return '';
    const lastLogin = new Date(authState.user.lastLogin);
    return lastLogin.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [authState]);

  return {
    // Состояние
    authState,
    isLoading,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    
    // Функции
    login,
    logout,
    checkPageAccess,
    checkRole,
    getUserRoleDisplayName,
    getLastLoginTime,
    
    // Утилиты
    canAccessAnalytics: checkRole('analyst'),
    canAccessChat: checkRole('operator'),
    isAdmin: checkRole('administrator')
  };
};