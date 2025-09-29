import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';
import { FilterState } from '../../types/transit';
import { AnimatedLogo } from './AnimatedLogo';
import { 
  BarChart3, 
  MessageSquare, 
  Home,
  TrendingUp,
  Database,
  Activity,
  Zap,
  Globe,
  Search
} from 'lucide-react';
import { NAVIGATION_ITEMS, PROBABILITY_DATA } from '../../data/staticData';

interface NavigationItem {
  path: string;
  name: string;
  icon: any;
  description: string;
  addSpaceAfter?: boolean;
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string, params?: any, activeTab?: string) => void;
  isCollapsed?: boolean;
}

export function Sidebar({ currentPath, onNavigate, isCollapsed = false }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Преобразуем данные из статического файла в формат для sidebar
  const navigationItems: NavigationItem[] = NAVIGATION_ITEMS.map((item, index) => ({
    path: item.path,
    name: item.title,
    icon: item.icon,
    description: item.description,
    addSpaceAfter: index === NAVIGATION_ITEMS.length - 1 // Добавляем пространство после последнего элемента
  }));

  // Анимированная статистика из централизованных данных
  const animatedStats = useMemo(() => 
    PROBABILITY_DATA.map(item => ({
      label: item.title.split(' ')[0], // Берем первое слово из названия
      value: item.value.toLocaleString(),
      probability: item.probability
    }))
  , []);

  return (
    <motion.aside 
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col relative z-20 h-full overflow-hidden"
      animate={{ 
        width: isCollapsed ? 64 : 256,
        opacity: 1
      }}
      initial={{ 
        width: isCollapsed ? 64 : 256,
        opacity: 0 
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 35,
        mass: 1
      }}
    >
      {/* Основной контейнер с прокруткой */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col sidebar-scroll-area">
        {/* Верхняя часть - логотип + навигация */}
        <div className="flex-shrink-0">
          {/* Логотип и текст - анимированное появление/исчезновение */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="header"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.8
                }}
                className="p-4 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex items-center space-x-3">
                  {/* Логотип */}
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50 dark:border-gray-700/50">
                      <AnimatedLogo size="sm" showText={false} />
                    </div>
                  </motion.div>
                  
                  {/* Текст Gray Tranzit */}
                  <motion.div 
                    className="flex-1 min-w-0"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.1
                    }}
                  >
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                      Gray Tranzit
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Railway Analytics System
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Навигация */}
          <nav className={cn(
            "space-y-1 transition-all duration-300 ease-in-out",
            isCollapsed ? "p-1" : "p-3"
          )}>
            {navigationItems.map((item, index) => (
              <div key={item.path}>
                <motion.button
                  onClick={() => onNavigate(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'w-full flex items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 relative group overflow-hidden',
                    isCollapsed ? 'p-3 justify-center' : 'px-3 py-3 space-x-3',
                    currentPath === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  title={isCollapsed ? item.name : undefined}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  {/* Анимированный фон для hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: hoveredItem === item.path ? 1 : 0,
                      scale: hoveredItem === item.path ? 1 : 0.8
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  />
                  
                  {/* Иконка - всегда видна с анимацией */}
                  <motion.div 
                    className="flex-shrink-0 flex items-center justify-center relative z-10"
                    animate={currentPath === item.path ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      currentPath === item.path ? "text-white" : ""
                    )} />
                  </motion.div>
                  
                  {/* Контент - плавное появление/исчезновение */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        key="nav-content"
                        className="flex-1 text-left min-w-0 overflow-hidden relative z-10"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          mass: 0.8
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-sm font-medium truncate",
                            currentPath === item.path ? "text-white" : ""
                          )}>
                            {item.name}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Индикатор активной страницы */}
                  {currentPath === item.path && (
                    <motion.div 
                      className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                      style={{ originY: 0.5 }}
                    />
                  )}
                </motion.button>
                
                {/* Добавляем пространство после AI Ассистента */}
                {item.addSpaceAfter && !isCollapsed && (
                  <motion.div
                    className="h-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "1.5rem" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: 0.1
                    }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Средняя часть - заполнитель */}
        <div className="flex-1 min-h-4" />
        
        {/* Нижняя часть - статистика и информация */}
        <div className="flex-shrink-0 mt-auto">
          {/* Статистика и информация - плавное появление */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="bottom-content"
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 1
                }}
                className="pb-4 overflow-hidden"
              >
                {/* Быстрая статистика */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Статистика
                  </h3>
                  <div className="space-y-1.5">
                    {animatedStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 cursor-pointer transition-colors"
                        data-clickable="true"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: index * 0.05
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        onClick={() => {
                          const filters: FilterState = {
                            probability_filter: {
                              high: stat.probability === 'high',
                              elevated: stat.probability === 'elevated',
                              medium: stat.probability === 'medium',
                              low: stat.probability === 'low'
                            },
                            anomaly_filter: {
                              weight: false,
                              time: false,
                              route: false,
                              duplicate: false,
                              no_anomalies: false
                            },
                            date_filter: { preset: 'week' },
                            geography_filter: { departure_countries: [], destination_countries: [], stations: [] },
                            cargo_filter: { cargo_types: [] },
                            quick_filters: { only_anomalies: false, high_probability_only: false, recent_only: false }
                          };
                          onNavigate('/transit-table', { 
                            filters,
                            highlight: `Фильтр по вероятности: ${stat.label}`
                          });
                        }}
                      >
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {stat.label}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                          {stat.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI рекомендации */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    AI рекомендации
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { 
                        title: "Проверить маршрут", 
                        subtitle: "Алматы → Шымкент", 
                        priority: "high", 
                        color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" 
                      },
                      { 
                        title: "Обновить данные", 
                        subtitle: "Вагон WAG123456", 
                        priority: "medium", 
                        color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" 
                      },
                      { 
                        title: "Создать отчет", 
                        subtitle: "За последнюю неделю", 
                        priority: "low", 
                        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" 
                      }
                    ].map((recommendation, index) => (
                      <motion.button
                        key={index}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/70 cursor-pointer transition-colors text-left"
                        data-clickable="true"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: 0.1 + index * 0.05
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        onClick={() => {
                          if (recommendation.title.includes('отчет')) {
                            onNavigate('/analytics', undefined, 'reports');
                          } else if (recommendation.title.includes('маршрут')) {
                            onNavigate('/transit-table');
                          } else {
                            onNavigate('/chat');
                          }
                        }}
                      >
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full">
                            {recommendation.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                            {recommendation.subtitle}
                          </span>
                        </div>
                        <motion.div 
                          className={cn('w-2 h-2 rounded-full flex-shrink-0 ml-2', 
                            recommendation.priority === 'high' ? 'bg-red-500' :
                            recommendation.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                          )}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Недавние поиски */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Недавние поиски
                  </h3>
                  <div className="space-y-1">
                    {[
                      "WAG123456",
                      "Алматы-Грузовая", 
                      "Аномалии за неделю"
                    ].map((search, index) => (
                      <motion.button
                        key={index}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        data-clickable="true"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: 0.15 + index * 0.05
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          x: 5,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        onClick={() => {
                          const filters: FilterState = {
                            probability_filter: { high: false, elevated: false, medium: false, low: false },
                            anomaly_filter: { weight: false, time: false, route: false, duplicate: false, no_anomalies: false },
                            date_filter: { preset: 'week' },
                            geography_filter: { departure_countries: [], destination_countries: [], stations: [] },
                            cargo_filter: { cargo_types: [] },
                            quick_filters: { only_anomalies: false, high_probability_only: false, recent_only: false }
                          };
                          onNavigate('/transit-table', { 
                            filters,
                            highlight: `Поиск: ${search}`
                          });
                        }}
                      >
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate block">
                          {search}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    className="w-full mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded text-center"
                    data-clickable="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.3
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    onClick={() => onNavigate('/transit-table')}
                  >
                    Очистить историю
                  </motion.button>
                </div>

                {/* Информация о версии и регионе */}
                <div className="p-3 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Gray Tranzit</span>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">v2.4.1</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Регион</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">KZ-Central</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-500">База данных</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">728.9K записей</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}