import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './components/ui/theme-provider';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AnimatedBackground } from './components/layout/AnimatedBackground';
import { Dashboard } from './pages/Dashboard';
import { ChatPage } from './pages/ChatPage';
import { TransitTablePage } from './pages/TransitTablePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/LoginPage';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { FilterState } from './types/transit';
import { cn } from './components/ui/utils';
import { useAuth } from './hooks/useAuth';
import { toast } from 'sonner@2.0.3';
import { ImportStatus } from './components/ui/import-status';

interface NavigationParams {
  filters?: FilterState;
  highlight?: string;
}

export default function App() {
  const { isAuthenticated, isLoading, login, logout, checkPageAccess, user } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [navigationParams, setNavigationParams] = useState<NavigationParams>({});
  const [analyticsActiveTab, setAnalyticsActiveTab] = useState<string>('analytics');
  const [backgroundVariant, setBackgroundVariant] = useState<'orbs' | 'geometric' | 'particles' | 'waves' | 'grid'>('orbs');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSidebarTip, setShowSidebarTip] = useState(true);

  const handleNavigation = (path: string, params?: NavigationParams, activeTab?: string) => {
    // Проверяем доступ к странице
    if (!checkPageAccess(path)) {
      toast.error('У вас нет доступа к данной странице');
      return;
    }
    
    setCurrentPath(path);
    setNavigationParams(params || {});
    if (activeTab && path === '/analytics') {
      setAnalyticsActiveTab(activeTab);
    }
  };

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      await login(credentials);
      setCurrentPath('/'); // Перенаправляем на главную после входа
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast.error('Неверные учетные данные');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPath('/');
      toast.success('Вы успешно вышли из системы');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const handleBackgroundChange = (variant: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid') => {
    setBackgroundVariant(variant);
  };

  // Обновляем title страницы
  useEffect(() => {
    document.title = getCurrentPageTitle();
  }, [currentPath]);

  // Скрываем подсказку через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSidebarTip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Скрываем подсказку при первом взаимодействии с сайдбаром
  useEffect(() => {
    if (!showSidebarTip) return;
    const hideTimer = setTimeout(() => {
      setShowSidebarTip(false);
    }, 3000); // Скрыть через 3 секунды после изменения состояния
    return () => clearTimeout(hideTimer);
  }, [isSidebarCollapsed]);

  // Скрываем внешний скролл body, оставляем только внутренние скроллы страниц
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Слушаем события хранилища
  useEffect(() => {
    const handleStorageCompressed = (event: CustomEvent) => {
      toast.warning('Данные сжаты', {
        description: `Сохранено ${event.detail.savedSamples} образцов из ${event.detail.totalRecords} записей из-за ограничений хранилища.`
      });
    };

    const handleStorageStatsOnly = (event: CustomEvent) => {
      toast.error('Данные слишком большие', {
        description: `Сохранена только статистика для ${event.detail.totalRecords} записей. Полные данные доступны только в текущей сессии.`
      });
    };

    const handleDataLoadedCompact = (event: CustomEvent) => {
      toast.info('Загружена компактная версия', {
        description: `Показано ${event.detail.loadedSamples} образцов из ${event.detail.totalRecords} записей.`
      });
    };

    window.addEventListener('data-storage-compressed', handleStorageCompressed as EventListener);
    window.addEventListener('data-storage-stats-only', handleStorageStatsOnly as EventListener);
    window.addEventListener('data-loaded-compact', handleDataLoadedCompact as EventListener);

    return () => {
      window.removeEventListener('data-storage-compressed', handleStorageCompressed as EventListener);
      window.removeEventListener('data-storage-stats-only', handleStorageStatsOnly as EventListener);
      window.removeEventListener('data-loaded-compact', handleDataLoadedCompact as EventListener);
    };
  }, []);

  const getCurrentPageTitle = () => {
    switch (currentPath) {
      case '/': return 'Gray Tranzit - Главная';
      case '/chat': return 'Gray Tranzit - AI Ассистент';
      case '/analytics': return 'Gray Tranzit - Аналитика';
      case '/transit-table': return 'Gray Tranzit - База знаний';
      default: return 'Gray Tranzit';
    }
  };

  const renderCurrentPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };

    const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.3
    };

    switch (currentPath) {
      case '/':
        return (
          <motion.div
            key="dashboard"
            initial="initial" 
            animate="in" 
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            <Dashboard onNavigate={handleNavigation} />
          </motion.div>
        );
      case '/chat':
        return (
          <motion.div
            key="chat"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            <ChatPage />
          </motion.div>
        );
      case '/analytics':
        return (
          <motion.div
            key="analytics"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            <AnalyticsPage onNavigateToTable={handleNavigation} initialActiveTab={analyticsActiveTab} />
          </motion.div>
        );
      case '/transit-table':
        return (
          <motion.div
            key="transit-table"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            <TransitTablePage 
              initialFilters={navigationParams.filters}
              highlightInfo={navigationParams.highlight}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard-default"
            initial="initial"
            animate="in" 
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full overflow-y-auto overflow-x-hidden"
          >
            <Dashboard onNavigate={handleNavigation} />
          </motion.div>
        );
    }
  };

  // Показываем загрузчик пока проверяется аутентификация
  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="smart-tranzit-theme">
        <div className="h-screen flex items-center justify-center app-background">
          <AnimatedBackground variant="orbs" />
          <div className="relative z-10 text-center">
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 dark:text-gray-400">Загрузка Gray Tranzit...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Показываем страницу входа если не аутентифицирован
  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="smart-tranzit-theme">
        <TooltipProvider delayDuration={200} skipDelayDuration={50}>
          <LoginPage onLogin={handleLogin} />
          <Toaster position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="smart-tranzit-theme">
      <TooltipProvider delayDuration={200} skipDelayDuration={50}>
        <motion.div 
          className="h-screen flex flex-col app-background scale-app relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
        {/* Анимированный фон */}
        <AnimatedBackground variant={backgroundVariant} />
        
        {/* Шапка */}
        <header className="sticky top-0 z-50 flex-shrink-0">
          <Header 
            backgroundVariant={backgroundVariant}
            onBackgroundChange={handleBackgroundChange}
            user={user}
            onLogout={handleLogout}
          />
        </header>
        
        {/* Основной контент - занимает всю оставшуюся высоту после header */}
        <div 
          className="flex-1 flex min-h-0 overflow-hidden"
          style={{ height: 'calc(100vh - 4rem)' }}
          onClick={(e) => {
            // Проверяем что клик был в пустой области (не на sidebar и не на интерактивных элементах)
            const target = e.target as HTMLElement;
            const isInSidebar = target.closest('aside');
            const isInteractiveElement = target.closest('button, input, select, textarea, a, [role="button"], [tabindex], [data-clickable="true"], .cursor-pointer');
            
            if (!isInSidebar && !isInteractiveElement) {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        >
          {/* Боковая панель */}
          <Sidebar 
            currentPath={currentPath} 
            onNavigate={handleNavigation}
            isCollapsed={isSidebarCollapsed}
          />
          
          {/* Основная область */}
          <main className="flex-1 relative z-0 h-full overflow-hidden">
            <AnimatePresence mode="wait">
              {renderCurrentPage()}
            </AnimatePresence>
          </main>
        </div>

        {/* Индикатор управления сайдбаром */}
        <AnimatePresence>
          {showSidebarTip && (
            <motion.div
              className="fixed bottom-4 right-4 z-50 pointer-events-none select-none"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 0.9, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm shadow-lg border border-white/20 max-w-xs"
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "0 15px 35px rgba(139, 92, 246, 0.4)", 
                    "0 10px 25px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💡</span>
                  <span>
                    Кликните в пустую область для {isSidebarCollapsed ? 'открытия' : 'скрытия'} меню
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Статус импорта */}
        <ImportStatus />

        {/* Уведомления */}
        <Toaster position="top-right" />
      </motion.div>
      </TooltipProvider>
    </ThemeProvider>
  );
}