// Middleware для проверки аутентификации

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
    lastLogin: string;
  } | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Имитация базы пользователей
const DEMO_USERS = [
  { username: 'beka', password: '2123', role: 'administrator' },
  { username: 'operator', password: 'operator', role: 'operator' },
  { username: 'analyst', password: 'analyst', role: 'analyst' },
  { username: 'demo', password: 'demo', role: 'viewer' }
];

// Ключ для localStorage
const AUTH_STORAGE_KEY = 'gray_tranzit_auth';

// Получение состояния аутентификации из localStorage
export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const authData = JSON.parse(stored);
      // Проверяем срок действия токена (24 часа)
      const lastLogin = new Date(authData.user?.lastLogin);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return authData;
      } else {
        // Токен истек, очищаем
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  } catch (error) {
    console.error('Ошибка при получении состояния аутентификации:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return { isAuthenticated: false, user: null };
};

// Сохранение состояния аутентификации в localStorage
export const setAuthState = (authState: AuthState): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Ошибка при сохранении состояния аутентификации:', error);
  }
};

// Очистка состояния аутентификации
export const clearAuthState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Ошибка при очистке состояния аутентификации:', error);
  }
};

// Проверка учетных данных
export const validateCredentials = (credentials: LoginCredentials): boolean => {
  const { username, password } = credentials;
  
  return DEMO_USERS.some(user => 
    user.username === username && user.password === password
  );
};

// Получение пользователя по учетным данным
export const getUserByCredentials = (credentials: LoginCredentials) => {
  const { username, password } = credentials;
  
  return DEMO_USERS.find(user => 
    user.username === username && user.password === password
  );
};

// Выполнение входа
export const login = (credentials: LoginCredentials): Promise<AuthState> => {
  return new Promise((resolve, reject) => {
    // Имитация задержки сети
    setTimeout(() => {
      if (validateCredentials(credentials)) {
        const user = getUserByCredentials(credentials);
        if (user) {
          const authState: AuthState = {
            isAuthenticated: true,
            user: {
              username: user.username,
              role: user.role,
              lastLogin: new Date().toISOString()
            }
          };
          
          setAuthState(authState);
          resolve(authState);
        } else {
          reject(new Error('Пользователь не найден'));
        }
      } else {
        reject(new Error('Неверные учетные данные'));
      }
    }, 800);
  });
};

// Выполнение выхода
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuthState();
      resolve();
    }, 300);
  });
};

// Проверка ролей пользователя
export const hasRole = (authState: AuthState, requiredRole: string): boolean => {
  if (!authState.isAuthenticated || !authState.user) {
    return false;
  }

  const roleHierarchy = {
    'viewer': 1,
    'operator': 2,
    'analyst': 3,
    'administrator': 4
  };

  const userLevel = roleHierarchy[authState.user.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};

// Проверка доступа к странице
export const canAccessPage = (authState: AuthState, page: string): boolean => {
  if (!authState.isAuthenticated) {
    return false;
  }

  // Правила доступа для разных страниц
  const pageRoles = {
    '/': 'viewer',           // Главная - все
    '/transit-table': 'viewer',  // Таблица - все
    '/chat': 'operator',     // Чат - оператор и выше
    '/analytics': 'analyst'  // Аналитика - аналитик и выше
  };

  const requiredRole = pageRoles[page as keyof typeof pageRoles] || 'viewer';
  return hasRole(authState, requiredRole);
};

// Получение отображаемого имени роли
export const getRoleDisplayName = (role: string): string => {
  const roleNames = {
    'viewer': 'Наблюдатель',
    'operator': 'Оператор',
    'analyst': 'Аналитик',
    'administrator': 'Администратор'
  };

  return roleNames[role as keyof typeof roleNames] || role;
};