// Страница входа в систему

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { AnimatedLogo } from '../components/layout/AnimatedLogo';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Activity, 
  Database,
  BarChart3,
  Lock,
  User,
  Globe,
  Zap,
  Train,
  Map,
  Network
} from 'lucide-react';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Имитация процесса входа
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (username && password) {
      toast.success('Добро пожаловать в Gray Tranzit! 🚄');
      // Добавляем конфетти эффект при успешном входе
      setTimeout(() => {
        onLogin({ username, password });
      }, 500);
    } else {
      toast.error('Пожалуйста, введите логин и пароль');
      setIsLoading(false);
    }
  };

  // Фиксированные значения для анимации - не будут пересчитываться при ререндере
  const animationParams = useMemo(() => {
    return {
      backgroundOrbs: Array.from({ length: 8 }).map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        xOffset: Math.random() * 80 - 40,
        yOffset: Math.random() * 80 - 40
      })),
      railElements: Array.from({ length: 4 }).map((_, i) => ({
        left: Math.random() * 80,
        rotation: Math.random() * 30 - 15
      })),
      floatingElements: Array.from({ length: 6 }).map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        xOffset: Math.random() * 40 - 20,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 3
      })),
      stars: Array.from({ length: 8 }).map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 4
      }))
    };
  }, []); // Пустая зависимость означает, что значения будут вычислены только один раз

  const systemStats = [
    { icon: Train, label: 'Транзитных маршрутов', value: '728,904', color: 'text-blue-600' },
    { icon: Network, label: 'Узлов мониторинга', value: '1,247', color: 'text-green-600' },
    { icon: BarChart3, label: 'Точность системы', value: '97.2%', color: 'text-purple-600' },
    { icon: Shield, label: 'Уровень защиты', value: '99.9%', color: 'text-indigo-600' }
  ];

  return (
    <div 
      className="min-h-screen flex relative overflow-hidden bg-background" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Адаптивный анимированный фон с яркими элементами */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
        {/* Яркие заметные анимированные элементы */}
        {animationParams.backgroundOrbs.map((params, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'rgba(59, 130, 246, 0.15)' :
                i % 3 === 1 ? 'rgba(147, 51, 234, 0.15)' :
                'rgba(34, 197, 94, 0.15)'
              } 0%, transparent 70%)`,
              width: `${150 + (i * 35)}px`,
              height: `${150 + (i * 35)}px`,
              filter: 'blur(20px)',
              left: `${params.left}%`,
              top: `${params.top}%`,
              opacity: 0.6
            }}
            animate={{
              x: [0, params.xOffset, 0],
              y: [0, params.yOffset, 0],
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 10 + (i * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
        
        {/* Дополнительные железнодорожные элементы */}
        {animationParams.railElements.map((params, i) => (
          <motion.div
            key={`rail-${i}`}
            className="absolute"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(34, 197, 94, 0.2))',
              width: '200px',
              height: '4px',
              borderRadius: '2px',
              left: `${params.left}%`,
              top: `${20 + (i * 20)}%`,
              transform: `rotate(${params.rotation}deg)`
            }}
            animate={{
              x: ['-50px', '50px', '-50px'],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + (i * 2),
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>
      
      {/* Яркие плавающие железнодорожные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {animationParams.floatingElements.map((params, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.4))' 
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.4))',
              width: `${6 + (i * 2)}px`,
              height: `${6 + (i * 2)}px`,
              left: `${params.left}%`,
              top: `${params.top}%`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, params.xOffset, 0],
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: params.duration,
              repeat: Infinity,
              delay: params.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Дополнительные мерцающие звезды */}
        {animationParams.stars.map((params, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: '#3b82f6',
              left: `${params.left}%`,
              top: `${params.top}%`,
              boxShadow: '0 0 4px #3b82f6'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: params.duration,
              repeat: Infinity,
              delay: params.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Левая панель с информацией */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-lg">
          {/* Логотип с дополнительными анимациями */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-lg p-2"
            >
              <AnimatedLogo size="lg" showText={true} />
            </motion.div>
          </motion.div>

          {/* Заголовок */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl font-bold mb-4 text-foreground"
              animate={{
                textShadow: [
                  '0 2px 4px rgba(59, 130, 246, 0.1)',
                  '0 4px 8px rgba(147, 51, 234, 0.15)',
                  '0 2px 4px rgba(59, 130, 246, 0.1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🚄 Gray Tranzit
            </motion.h1>
            <h2 className="text-2xl mb-6 font-medium text-foreground">
              Мониторинг транзитных операций
            </h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Разработано АО "Транстелеком" для интеллектуального анализа железнодорожных перевозок Казахстана
            </p>
          </motion.div>

          {/* Статистика системы */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {systemStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-4 rounded-lg backdrop-blur-sm border-2 border dynamic-bg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3">
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Казахстанские железнодорожные изображения */}
          <motion.div 
            className="grid grid-cols-3 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              className="relative h-20 rounded-lg overflow-hidden border-2 border-gray-200"
              whileHover={{ scale: 1.05 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1523299746571-fa1412c28fb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXpha2hzdGFuJTIwcmFpbHdheSUyMHdvcmtlcnMlMjB0cmFpbnxlbnwxfHx8fDE3NTc3NTExMTV8MA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Железнодорожники Казахстана"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-1 left-1 text-white text-xs font-medium">
                Специалисты
              </div>
            </motion.div>
            
            <motion.div
              className="relative h-20 rounded-lg overflow-hidden border-2 border-gray-200"
              whileHover={{ scale: 1.05 }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1713104367425-dcfa7059e756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW50cmFsJTIwYXNpYSUyMHJhaWx3YXklMjB0cmFuc3BvcnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1Nzc1MTExOXww&ixlib=rb-4.1.0&q=80&w=400"
                alt="Транспорт Центральной Азии"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-1 left-1 text-white text-xs font-medium">
                Транспорт
              </div>
            </motion.div>
            
            <motion.div
              className="relative h-20 rounded-lg overflow-hidden border-2 border-gray-200"
              whileHover={{ scale: 1.05 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1593225602101-a6220830c8d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFpbiUyMGNvbnRyb2wlMjByb29tJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTc3NTExMjN8MA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Современные технологии"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-1 left-1 text-white text-xs font-medium">
                Технологии
              </div>
            </motion.div>
          </motion.div>

          {/* Версия и статус */}
          <motion.div 
            className="flex items-center space-x-4 text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <div className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span>v2.4.1</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-green-500" />
              <span>KZ-Central</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Система активна
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Правая панель с формой входа */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card 
          className="w-full max-w-md shadow-2xl border-2 border dynamic-bg relative overflow-hidden"
          style={{ 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Декоративные элементы для карточки */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>
          <motion.div
            className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-yellow-400/10 to-green-400/10 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                <Lock className="h-6 w-6 text-blue-600" />
                <span>Вход в систему</span>
              </CardTitle>
              <p className="text-center mt-2 font-medium text-muted-foreground">
                Введите свои учетные данные для доступа
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* Поле логина */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Логин</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите логин"
                  className="h-12 bg-input border-2 border focus:border-blue-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              {/* Поле пароля */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Пароль</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pr-10 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    style={{ 
                      backgroundColor: '#f9fafb',
                      borderColor: '#e5e7eb'
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Информация о компании */}
              <motion.div 
                className="p-3 rounded-lg border border-green-200"
                style={{ background: 'linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.05))' }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Train className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">
                    АО "Транстелеком"
                  </p>
                </div>
                <p className="text-xs text-green-600">
                  Национальная телекоммуникационная компания Казахстана
                </p>
              </motion.div>

              {/* Кнопка входа */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-green-200 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-yellow-200 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                    <span>Подключение к системе...</span>
                  </motion.div>
                ) : (
                  <span>Войти в систему</span>
                )}
              </Button>
            </motion.form>

            {/* Дополнительная информация */}
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <p className="text-xs font-medium" style={{ color: '#4b5563' }}>
                Защищено end-to-end шифрованием
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                Соответствует требованиям законодательства РК о персональных данных
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};