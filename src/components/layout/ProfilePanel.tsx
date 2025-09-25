// Панель профиля пользователя

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Key,
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    username: string;
    role: string;
    lastLogin: string;
  } | null;
  onLogout?: () => void;
}

export function ProfilePanel({ isOpen, onClose, user, onLogout }: ProfilePanelProps) {
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'administrator': 'Системный администратор',
      'analyst': 'Аналитик данных',
      'operator': 'Оператор системы',
      'viewer': 'Наблюдатель'
    };
    return roleNames[role as keyof typeof roleNames] || 'Пользователь';
  };

  const getDepartmentName = (role: string) => {
    const departments = {
      'administrator': 'IT отдел',
      'analyst': 'Аналитический отдел',
      'operator': 'Операционный отдел',
      'viewer': 'Наблюдение'
    };
    return departments[role as keyof typeof departments] || 'Общий отдел';
  };

  const [profileData, setProfileData] = useState({
    name: user?.username || 'Пользователь',
    email: `${user?.username || 'user'}@graytranzit.com`,
    phone: '+7 (495) 123-45-67',
    position: getRoleDisplayName(user?.role || 'viewer'),
    department: getDepartmentName(user?.role || 'viewer'),
    location: 'Москва, Россия',
    joinDate: '2023-03-15',
    lastActive: user?.lastLogin || new Date().toISOString()
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
    loginAlerts: true
  });

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Левая панель с аватаром */}
          <div className="w-80 bg-gradient-to-b from-blue-600 to-purple-700 p-6 text-white">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src="/avatars/admin.jpg" />
                  <AvatarFallback className="text-2xl bg-white/10">
                    {user?.username?.slice(0, 2).toUpperCase() || 'ПК'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
              <p className="text-blue-100 mb-2">{profileData.position}</p>
              <Badge variant="secondary" className="mb-4">
                {profileData.department}
              </Badge>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>В команде с {new Date(profileData.joinDate).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Активен: {new Date(profileData.lastActive).toLocaleString('ru-RU')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <Button 
                variant="ghost" 
                className="w-full text-white hover:bg-white/10 justify-start"
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти из системы
              </Button>
            </div>
          </div>

          {/* Правая панель с настройками */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Настройки профиля</h1>
              <Button variant="ghost" onClick={onClose}>
                ×
              </Button>
            </div>

            <Tabs defaultValue="profile" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Профиль</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Уведомления</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Безопасность</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Настройки</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 h-[calc(100%-8rem)] overflow-y-auto">
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Личная информация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Полное имя</Label>
                          <Input 
                            id="name" 
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Должность</Label>
                          <Input 
                            id="position" 
                            value={profileData.position}
                            onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Телефон</Label>
                          <Input 
                            id="phone" 
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Местоположение</Label>
                        <Input 
                          id="location" 
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Уведомления</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email уведомления</Label>
                          <p className="text-sm text-gray-500">Получать уведомления на email</p>
                        </div>
                        <Switch 
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Push уведомления</Label>
                          <p className="text-sm text-gray-500">Уведомления в браузере</p>
                        </div>
                        <Switch 
                          id="push-notifications"
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications">SMS уведомления</Label>
                          <p className="text-sm text-gray-500">Критические алерты по SMS</p>
                        </div>
                        <Switch 
                          id="sms-notifications"
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="desktop-notifications">Системные уведомления</Label>
                          <p className="text-sm text-gray-500">Уведомления рабочего стола</p>
                        </div>
                        <Switch 
                          id="desktop-notifications"
                          checked={notifications.desktop}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, desktop: checked }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Безопасность</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
                          <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                        </div>
                        <Switch 
                          id="two-factor"
                          checked={security.twoFactor}
                          onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Тайм-аут сессии (минуты)</Label>
                        <Input 
                          id="session-timeout" 
                          type="number"
                          value={security.sessionTimeout}
                          onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="login-alerts">Алерты входа</Label>
                          <p className="text-sm text-gray-500">Уведомления о входах в систему</p>
                        </div>
                        <Switch 
                          id="login-alerts"
                          checked={security.loginAlerts}
                          onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full">
                          <Key className="h-4 w-4 mr-2" />
                          Изменить пароль
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Системные настройки</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Язык интерфейса</Label>
                        <select className="w-full p-2 border rounded" id="language">
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Часовой пояс</Label>
                        <select className="w-full p-2 border rounded" id="timezone">
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date-format">Формат даты</Label>
                        <select className="w-full p-2 border rounded" id="date-format">
                          <option value="DD.MM.YYYY">31.12.2023</option>
                          <option value="MM/DD/YYYY">12/31/2023</option>
                          <option value="YYYY-MM-DD">2023-12-31</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button>
                  Сохранить изменения
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}