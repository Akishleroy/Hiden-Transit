// Компонент шапки приложения

import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Settings, User, Sun, Moon, Monitor, Activity, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTheme } from '../ui/theme-provider';
import { ThemeBackgroundController } from '../ui/theme-background-controller';
import { BackgroundSelector } from './BackgroundSelector';
import { NotificationPanel } from './NotificationPanel';
import { ProfilePanel } from './ProfilePanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  backgroundVariant?: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid';
  onBackgroundChange?: (variant: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid') => void;
  user?: {
    username: string;
    role: string;
    lastLogin: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ backgroundVariant = 'orbs', onBackgroundChange, user, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = getThemeIcon();

  return (
    <>
      <motion.header 
        className="h-16 dynamic-bg backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 relative"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Левая часть - Система мониторинга */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 0 10px rgba(16, 185, 129, 0.3)",
                  "0 0 20px rgba(16, 185, 129, 0.5)", 
                  "0 0 10px rgba(16, 185, 129, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Система мониторинга</span>
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Активна • 728,904+ записей</span>
              </div>
            </div>
          </div>
          
          {/* Индикаторы производительности */}
          <div className="flex items-center space-x-4 ml-8">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="text-xs">
                <span className="text-gray-500 dark:text-gray-400">Загрузка:</span>
                <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">12%</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <div className="text-xs">
                <span className="text-gray-500 dark:text-gray-400">Скорость:</span>
                <span className="ml-1 font-medium text-amber-600 dark:text-amber-400">3.2ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть - Действия и профиль */}
        <div className="flex items-center space-x-2">
          {/* Контроллер фона темы */}
          <ThemeBackgroundController />
          
          {/* Селектор анимированного фона */}
          {onBackgroundChange && (
            <BackgroundSelector 
              currentVariant={backgroundVariant}
              onVariantChange={onBackgroundChange}
            />
          )}
          
          {/* Переключатель темы */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cycleTheme}
              className="relative h-9 w-9 rounded-full"
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Уведомления */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative h-9 w-9 rounded-full"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4" />
              <motion.div
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                3
              </motion.div>
            </Button>
          </motion.div>

          {/* Настройки */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 rounded-full"
              onClick={() => setShowProfile(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Профиль пользователя */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                    <AvatarImage src="/avatars/admin.jpg" alt="Пользователь" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.username?.slice(0, 2).toUpperCase() || 'ПК'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || 'Пользователь'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.username}@graytranzit.com
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {user?.role === 'administrator' ? 'Администратор' :
                     user?.role === 'analyst' ? 'Аналитик' :
                     user?.role === 'operator' ? 'Оператор' :
                     user?.role === 'viewer' ? 'Наблюдатель' : 'Пользователь'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Профиль и настройки</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNotifications(true)}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Уведомления</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400 cursor-pointer"
                onClick={onLogout}
              >
                Выйти из системы
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Панели */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <ProfilePanel 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)}
        user={user}
        onLogout={onLogout}
      />
    </>
  );
}