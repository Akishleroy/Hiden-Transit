// Панель уведомлений

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Settings,
  Check,
  Trash2
} from 'lucide-react';
import { cn } from '../ui/utils';

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Критическая аномалия обнаружена',
    message: 'Вагон WAG123456 показывает отклонение веса на 78%. Требует немедленного внимания.',
    timestamp: '2024-01-15T14:30:00Z',
    read: false,
    actionable: true
  },
  {
    id: '2', 
    type: 'warning',
    title: 'Подозрительная активность маршрута',
    message: 'Маршрут Москва-Владивосток показывает необычные временные паттерны.',
    timestamp: '2024-01-15T13:15:00Z',
    read: false,
    actionable: true
  },
  {
    id: '3',
    type: 'info',
    title: 'Обновление системы завершено',
    message: 'AI модель аномалий обновлена до версии 2.1.4',
    timestamp: '2024-01-15T12:00:00Z',
    read: true
  },
  {
    id: '4',
    type: 'success',
    title: 'Месячный отчет готов',
    message: 'Отчет по аномалиям за декабрь 2023 успешно сгенерирован.',
    timestamp: '2024-01-15T10:30:00Z',
    read: true
  }
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return time.toLocaleDateString('ru-RU');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <Card className="h-full rounded-none border-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Уведомления</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {unreadCount > 0 && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Прочитать все
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Настройки
                    </Button>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Нет уведомлений</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const IconComponent = getTypeIcon(notification.type);
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              'relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md',
                              notification.read 
                                ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
                                : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 shadow-sm'
                            )}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                          >
                            {!notification.read && (
                              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            
                            <div className="flex items-start space-x-3">
                              <div className={cn(
                                'p-1 rounded-full flex-shrink-0',
                                getTypeColor(notification.type)
                              )}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTime(notification.timestamp)}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    {notification.actionable && (
                                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                        Действие
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}